import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from xgboost import XGBClassifier

# === Load semua model & scaler ===
rf_model = joblib.load('heart_disease_models/rf_model.pkl')
ffnn_model = tf.keras.models.load_model('heart_disease_models/ffnn_model.h5')
xgb_model = joblib.load('heart_disease_models/xgb_model.pkl')
meta_model = joblib.load('heart_disease_models/meta_model.pkl')
scaler = joblib.load('heart_disease_models/scaler.pkl')
feature_columns = joblib.load('heart_disease_models/feature_columns.pkl')

# === Load test dataset ===
df = pd.read_csv('heart_test.csv', delimiter=';')
df.columns = df.columns.str.strip()

X_test = df[feature_columns]
y_true = df['HeartDiseaseorAttack'].astype(int)

# === Standarisasi fitur ===
X_test_scaled = scaler.transform(X_test)

# === Prediksi masing-masing model ===
rf_probs = rf_model.predict_proba(X_test_scaled)[:, 1]
ffnn_probs = ffnn_model.predict(X_test_scaled).flatten()
xgb_probs = xgb_model.predict_proba(X_test_scaled)[:, 1]

# === Stacking: input untuk meta-model ===
stacked_inputs = np.column_stack((rf_probs, ffnn_probs, xgb_probs))
final_probs = meta_model.predict_proba(stacked_inputs)[:, 1]
final_preds = (final_probs >= 0.5).astype(int)

# === Tambahkan kolom ke DataFrame ===
df.insert(0, 'prediction', final_preds)

# Ubah 1 -> "Benar", 0 -> "Salah"
correct_labels = np.where(final_preds == y_true, 'Benar', 'Salah')
df.insert(1, 'correct', correct_labels)

# === Simpan ke Excel ===
output_path = 'heart_test.xlsx'
df.to_excel(output_path, index=False)
print(f"✅ Hasil prediksi disimpan ke: {output_path}")
