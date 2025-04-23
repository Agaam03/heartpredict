import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
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

        print("Training XGBoost model...")
        # Train XGBoost model
        xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
        xgb_model.fit(X_train_resampled, y_train_resampled)
        xgb_preds = xgb_model.predict_proba(X_test_scaled)[:, 1]

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
        
        # Get final predictions and probabilities
        final_probs = meta_model.predict_proba(stacked_preds)[:, 1]
        final_preds = meta_model.predict(stacked_preds)
        
        # Evaluate the stacked model
        print("\nModel Evaluation:")
        print(f"Accuracy: {accuracy_score(y_test, final_preds):.4f}")
        print(f"Precision: {precision_score(y_test, final_preds, zero_division=0):.4f}")
        print(f"Recall: {recall_score(y_test, final_preds, zero_division=0):.4f}")
        print(f"F1 Score: {f1_score(y_test, final_preds, zero_division=0):.4f}")
        
        # Calculate AUC
        fpr, tpr, _ = roc_curve(y_test, final_probs)
        roc_auc = auc(fpr, tpr)
        print(f"AUC: {roc_auc:.4f}")
        
        print("\nClassification Report:")
        print(classification_report(y_test, final_preds))
        
        # Create confusion matrix
        cm = confusion_matrix(y_test, final_preds)
        
        if visualize:
            self._visualize_metrics(y_test, final_preds, final_probs, cm)
        
        # Save evaluation metrics
        eval_metrics = {
            'accuracy': accuracy_score(y_test, final_preds),
            'precision': precision_score(y_test, final_preds, zero_division=0),
            'recall': recall_score(y_test, final_preds, zero_division=0),
            'f1_score': f1_score(y_test, final_preds, zero_division=0),
            'auc': roc_auc,
            'confusion_matrix': cm.tolist()
        }
        joblib.dump(eval_metrics, os.path.join(self.model_dir, 'evaluation_metrics.pkl'))
        
        # Return the prediction function for immediate use
        return self.load_saved_models()
    
    def _visualize_metrics(self, y_test, y_pred, y_prob, cm):
        """Visualize various model performance metrics"""
        # Create a directory for visualizations
        viz_dir = os.path.join(self.model_dir, 'visualizations')
        os.makedirs(viz_dir, exist_ok=True)
        
        # Set figure aesthetics
        plt.style.use('seaborn-v0_8-darkgrid')
        
        # 1. Confusion Matrix
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
        plt.title('Confusion Matrix', fontsize=16)
        plt.ylabel('True Label', fontsize=12)
        plt.xlabel('Predicted Label', fontsize=12)
        plt.tight_layout()
        plt.savefig(os.path.join(viz_dir, 'confusion_matrix.png'), dpi=300)
        plt.close()
        
        # 2. ROC Curve
        plt.figure(figsize=(8, 6))
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, color='darkorange', lw=2, 
                 label=f'ROC curve (area = {roc_auc:.2f})')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate', fontsize=12)
        plt.ylabel('True Positive Rate', fontsize=12)
        plt.title('Receiver Operating Characteristic (ROC) Curve', fontsize=16)
        plt.legend(loc="lower right")
        plt.tight_layout()
        plt.savefig(os.path.join(viz_dir, 'roc_curve.png'), dpi=300)
        plt.close()
        
        # 3. Precision-Recall Curve
        plt.figure(figsize=(8, 6))
        precision, recall, _ = precision_recall_curve(y_test, y_prob)
        avg_precision = average_precision_score(y_test, y_prob)
        plt.plot(recall, precision, color='blue', lw=2, 
                 label=f'Precision-Recall curve (AP = {avg_precision:.2f})')
        plt.axhline(y=sum(y_test)/len(y_test), color='red', linestyle='--', 
                    label=f'Baseline (y_freq = {sum(y_test)/len(y_test):.2f})')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('Recall', fontsize=12)
        plt.ylabel('Precision', fontsize=12)
        plt.title('Precision-Recall Curve', fontsize=16)
        plt.legend(loc="best")
        plt.tight_layout()
        plt.savefig(os.path.join(viz_dir, 'precision_recall_curve.png'), dpi=300)
        plt.close()
        
        # 4. Model Metrics Bar Chart
        metrics = ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'AUC']
        values = [
            accuracy_score(y_test, y_pred),
            precision_score(y_test, y_pred, zero_division=0),
            recall_score(y_test, y_pred, zero_division=0),
            f1_score(y_test, y_pred, zero_division=0),
            roc_auc
        ]
        
        plt.figure(figsize=(10, 6))
        bars = plt.bar(metrics, values, color='steelblue')
        plt.ylim(0, 1.05)
        plt.ylabel('Score', fontsize=12)
        plt.title('Model Performance Metrics', fontsize=16)
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                    f'{height:.2f}', ha='center', va='bottom', fontsize=10)
        
        plt.tight_layout()
        plt.savefig(os.path.join(viz_dir, 'model_metrics.png'), dpi=300)
        plt.close()
        
        print(f"\nVisualizations saved to {viz_dir}")

    
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