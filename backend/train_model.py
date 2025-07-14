import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import csv
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score,
    precision_score, recall_score, f1_score, roc_curve, auc,
    precision_recall_curve, average_precision_score
)
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense


class StackingHeartDiseaseModel:
    def __init__(self, model_dir='heart_disease_models'):
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        self.feature_columns = [
            'HighBP', 'HighChol', 'CholCheck', 'BMI', 'Smoker', 'Stroke', 
            'Diabetes', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 
            'AnyHealthcare', 'NoDocbcCost', 'GenHlth', 'MentHlth', 'PhysHlth', 
            'DiffWalk', 'Sex', 'Age', 'Education', 'Income'
        ]
        self.target_column = 'HeartDiseaseorAttack'
        # Define risk thresholds for categorization
        self.risk_thresholds = {
            'low': 0.1,     # Probability < 0.3 -> Low risk
            'medium': 0.5   # 0.3 <= Probability < 0.7 -> Medium risk, >= 0.7 -> High risk
        }

    def evaluate_and_visualize(self, name, y_true, y_prob):
        y_pred = (y_prob >= 0.5).astype(int)
        cm = confusion_matrix(y_true, y_pred)
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        fpr, tpr, _ = roc_curve(y_true, y_prob)
        roc_auc_val = auc(fpr, tpr)
        avg_prec = average_precision_score(y_true, y_prob)

        print(f"\n===== {name} Model Evaluation =====")
        print(f"Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | AUC: {roc_auc_val:.4f}")

        viz_path = os.path.join(self.model_dir, "visualizations", name)
        os.makedirs(viz_path, exist_ok=True)

        # Save confusion matrix
        plt.figure(figsize=(6, 4))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title(f'{name} - Confusion Matrix')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.tight_layout()
        plt.savefig(os.path.join(viz_path, 'confusion_matrix.png'))
        plt.close()

        # Save ROC Curve
        plt.figure(figsize=(6, 4))
        plt.plot(fpr, tpr, label=f'AUC = {roc_auc_val:.2f}')
        plt.plot([0, 1], [0, 1], 'k--')
        plt.title(f'{name} - ROC Curve')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(viz_path, 'roc_curve.png'))
        plt.close()

        # Save Precision-Recall Curve
        precision, recall, _ = precision_recall_curve(y_true, y_prob)
        plt.figure(figsize=(6, 4))
        plt.plot(recall, precision, label=f'AP = {avg_prec:.2f}')
        plt.title(f'{name} - Precision-Recall Curve')
        plt.xlabel('Recall')
        plt.ylabel('Precision')
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(viz_path, 'precision_recall_curve.png'))
        plt.close()

        # Save metrics bar chart
        plt.figure(figsize=(6, 4))
        metrics = [acc, prec, rec, f1, roc_auc_val]
        labels = ['Accuracy', 'Precision', 'Recall', 'F1', 'AUC']
        sns.barplot(x=labels, y=metrics, palette='pastel')
        for i, v in enumerate(metrics):
            plt.text(i, v + 0.01, f"{v:.2f}", ha='center')
        plt.ylim(0, 1.1)
        plt.title(f'{name} - Metrics')
        plt.tight_layout()
        plt.savefig(os.path.join(viz_path, 'metrics_bar.png'))
        plt.close()

        # Save metrics to CSV
        csv_path = os.path.join(self.model_dir, "visualizations", "evaluation_metrics.csv")
        file_exists = os.path.isfile(csv_path)
        with open(csv_path, mode='a', newline='') as csv_file:
            writer = csv.writer(csv_file)
            if not file_exists:
                writer.writerow(["Model", "Accuracy", "Precision", "Recall", "F1 Score", "AUC"])
            writer.writerow([name, acc, prec, rec, f1, roc_auc_val])
            
        # === Prepare Data for Excel ===
        metrics_dict = {
            "Model": name,
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1 Score": f1,
            "AUC": roc_auc_val
        }
        metrics_df = pd.DataFrame([metrics_dict]).round(2)

        cm_df = pd.DataFrame(cm, columns=["Predicted_0", "Predicted_1"], index=["Actual_0", "Actual_1"])

        # === Save to Excel ===
        excel_path = os.path.join(viz_path, f"{name}_evaluation.xlsx")
        with pd.ExcelWriter(excel_path, engine='xlsxwriter') as writer:
            metrics_df.to_excel(writer, index=False, sheet_name='Metrics')
            cm_df.to_excel(writer, sheet_name='ConfusionMatrix')

        return {
            "accuracy": acc, "precision": prec, "recall": rec,
            "f1_score": f1, "auc": roc_auc_val
        }



    def train_and_save_models(self, data_path, visualize=True):
        # Load data
        if data_path.endswith('.csv'):
            df = pd.read_csv(data_path)
        else:
            # If the data is provided as a string with comma-separated values
            rows = data_path.strip().split('\n')
            header = rows[0].split(',')
            data = [row.split(',') for row in rows[1:]]
            df = pd.DataFrame(data, columns=header)
            df = df.apply(pd.to_numeric, errors='ignore')  # Convert all possible values to numeric

        # Ensure all features are present
        for col in [self.target_column] + self.feature_columns:
            if col not in df.columns:
                raise ValueError(f"Missing required column: {col}")

        # Prepare features and target
        X = df[self.feature_columns]
        y = df[self.target_column]

        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Scale the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Handle class imbalance using SMOTE
        smote = SMOTE(random_state=42)
        X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)

        print("Training Random Forest model...")
        # Train Random Forest model
        rf_model = RandomForestClassifier(random_state=42)
        rf_model.fit(X_train_resampled, y_train_resampled)
        rf_preds = rf_model.predict_proba(X_test_scaled)[:, 1]
        rf_metrics = self.evaluate_and_visualize("RandomForest", y_test, rf_preds)

        print("Training Neural Network model...")
        # Train Neural Network model
        input_layer = tf.keras.layers.Input(shape=(X_train_resampled.shape[1],))
        hidden1 = Dense(32, activation='relu')(input_layer)
        hidden2 = Dense(16, activation='relu')(hidden1)
        output_layer = Dense(1, activation='sigmoid')(hidden2)
        ffnn_model = tf.keras.models.Model(inputs=input_layer, outputs=output_layer)

        ffnn_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        ffnn_model.fit(X_train_resampled, y_train_resampled, epochs=50, batch_size=16, verbose=1)
        ffnn_preds = ffnn_model.predict(X_test_scaled).flatten()
        ffnn_metrics = self.evaluate_and_visualize("FFNN", y_test, ffnn_preds)

        print("Training XGBoost model...")
        # Train XGBoost model
        xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
        xgb_model.fit(X_train_resampled, y_train_resampled)
        xgb_preds = xgb_model.predict_proba(X_test_scaled)[:, 1]
        xgb_metrics = self.evaluate_and_visualize("XGBoost", y_test, xgb_preds)

        # Combine predictions for meta-model
        stacked_preds = np.column_stack((rf_preds, ffnn_preds, xgb_preds))

        print("Training meta-model...")
        # Train meta-model
        meta_model = LogisticRegression()
        meta_model.fit(stacked_preds, y_test)

        # Save all models
        print("Saving models...")
        joblib.dump(rf_model, os.path.join(self.model_dir, 'rf_model.pkl'))
        ffnn_model.save(os.path.join(self.model_dir, 'ffnn_model.h5'))
        joblib.dump(xgb_model, os.path.join(self.model_dir, 'xgb_model.pkl'))
        joblib.dump(meta_model, os.path.join(self.model_dir, 'meta_model.pkl'))
        joblib.dump(scaler, os.path.join(self.model_dir, 'scaler.pkl'))
        joblib.dump(self.feature_columns, os.path.join(self.model_dir, 'feature_columns.pkl'))
        joblib.dump(self.risk_thresholds, os.path.join(self.model_dir, 'risk_thresholds.pkl'))

        print("Models saved successfully!")
        
        final_probs = meta_model.predict_proba(stacked_preds)[:, 1]
        stacked_metrics = self.evaluate_and_visualize("Stacking", y_test, final_probs)

        all_metrics = {
            "RandomForest": rf_metrics,
            "FFNN": ffnn_metrics,
            "XGBoost": xgb_metrics,
            "Stacking": stacked_metrics
        }
        joblib.dump(all_metrics, os.path.join(self.model_dir, 'all_models_metrics.pkl'))

        return self.load_saved_models()
    
    
# Example usage with your data format
if __name__ == "__main__":
    # Create an instance of the model
    stacking_model = StackingHeartDiseaseModel()
    
    # Option 1: If you have a CSV file with your data
    data_path = 'heart_new.csv'
    
    # Check if file exists
    if not os.path.exists(data_path):
        print(f"Warning: The file '{data_path}' was not found. Generating synthetic data for demonstration.")
        
        # Generate synthetic data for demonstration
        header = ["HeartDiseaseorAttack"] + stacking_model.feature_columns
        
        # Create a DataFrame with 1000 rows
        np.random.seed(42)  # For reproducibility
        synthetic_data = []
        
        for _ in range(1000):
            row = {
                'HeartDiseaseorAttack': np.random.choice([0, 1], p=[0.7, 0.3]),  # 30% with heart disease
                'HighBP': np.random.choice([0, 1]),
                'HighChol': np.random.choice([0, 1]),
                'CholCheck': np.random.choice([0, 1]),
                'BMI': np.random.uniform(18, 45),
                'Smoker': np.random.choice([0, 1]),
                'Stroke': np.random.choice([0, 1], p=[0.9, 0.1]),
                'Diabetes': np.random.choice([0, 1], p=[0.85, 0.15]),
                'PhysActivity': np.random.choice([0, 1]),
                'Fruits': np.random.choice([0, 1]),
                'Veggies': np.random.choice([0, 1]),
                'HvyAlcoholConsump': np.random.choice([0, 1], p=[0.8, 0.2]),
                'AnyHealthcare': np.random.choice([0, 1], p=[0.1, 0.9]),
                'NoDocbcCost': np.random.choice([0, 1], p=[0.8, 0.2]),
                'GenHlth': np.random.randint(1, 6),
                'MentHlth': np.random.randint(0, 31),
                'PhysHlth': np.random.randint(0, 31),
                'DiffWalk': np.random.choice([0, 1]),
                'Sex': np.random.choice([0, 1]),
                'Age': np.random.randint(1, 14),
                'Education': np.random.randint(1, 7),
                'Income': np.random.randint(1, 9)
            }
            synthetic_data.append(row)
        
        synthetic_df = pd.DataFrame(synthetic_data)
        
        # Save to CSV
        data_path = 'synthetic_heart_data.csv'
        synthetic_df.to_csv(data_path, index=False)
        print(f"Synthetic data saved to {data_path}")
    
    # Train and evaluate the model
    try:
        print("Starting model training...")
        predict_fn = stacking_model.train_and_save_models(data_path, visualize=True)
        print("Training completed successfully!")
        
        # Example of using the prediction function
        sample_input = {
            'HighBP': 1,
            'HighChol': 1,
            'CholCheck': 1,
            'BMI': 40,
            'Smoker': 1,
            'Stroke': 0,
            'Diabetes': 0,
            'PhysActivity': 0,
            'Fruits': 0,
            'Veggies': 1,
            'HvyAlcoholConsump': 0,
            'AnyHealthcare': 1,
            'NoDocbcCost': 0,
            'GenHlth': 5,
            'MentHlth': 18,
            'PhysHlth': 15,
            'DiffWalk': 1,
            'Sex': 0,
            'Age': 9,
            'Education': 4,
            'Income': 3
        }
        
        # Make a prediction with risk level
        result = predict_fn(sample_input, return_proba=True)
        print("\nSample Input Prediction Results:")
        print(f"Binary Prediction: {result['prediction']} (0=No Disease, 1=Disease)")
        print(f"Probability: {result['probability']:.4f}")
        print(f"Risk Level: {result['risk_level']}")
        
        # Show model performance from saved metrics
        try:
            metrics = joblib.load(os.path.join(stacking_model.model_dir, 'evaluation_metrics.pkl'))
            print("\nSummary of Model Performance:")
            print(f"Accuracy: {metrics['accuracy']:.4f}")
            print(f"Precision: {metrics['precision']:.4f}")
            print(f"Recall: {metrics['recall']:.4f}")
            print(f"F1 Score: {metrics['f1_score']:.4f}")
            print(f"AUC: {metrics['auc']:.4f}")
            print(f"\nVisualizations are saved in: {os.path.join(stacking_model.model_dir, 'visualizations')}")
            
        except Exception as e:
            print(f"Could not load metrics: {str(e)}")
    
    except Exception as e:
        print(f"Error during training: {str(e)}")
        import traceback
        traceback.print_exc()