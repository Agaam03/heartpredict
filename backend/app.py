from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from pymongo import MongoClient
from groq import Groq
import pandas as pd
import numpy as np
import os
import tensorflow as tf
import joblib
import requests
from datetime import datetime

# === Fungsi download model dari Hugging Face ===
# def download_model_from_huggingface(filename, model_dir):
#     os.makedirs(model_dir, exist_ok=True)
#     file_path = os.path.join(model_dir, filename)
    
#     # URL for raw file download from Hugging Face
#     url = f"https://huggingface.co/Agaam/heart-disease/resolve/main/heart_disease_models/{filename}"
    
#     print(f"📥 Downloading {filename}...")
#     response = requests.get(url)
#     if response.status_code == 200:
#         with open(file_path, "wb") as f:
#             f.write(response.content)
#         print(f"✅ Successfully downloaded {filename}")
#         return True
#     else:
#         print(f"❌ Failed to download {filename}. Status code: {response.status_code}")
#         return False

class HeartDiseasePredictor:
    def __init__(self, model_dir="heart_disease_models"):
        self.model_dir = model_dir
        self.risk_thresholds = {'low': 0.3, 'medium': 0.7}  # Default values
        self.required_files = [
            "evaluation_metrics.pkl",
            "feature_columns.pkl",
            "ffnn_model.h5",
            "meta_model.pkl",
            "rf_model.pkl",
            "risk_thresholds.pkl",
            "scaler.pkl",
            "xgb_model.pkl"
        ]
        self.load_models()
    
    def load_models(self):
        # Check if all required files exist
        missing_files = []
        for filename in self.required_files:
            file_path = os.path.join(self.model_dir, filename)
            if not os.path.exists(file_path):
                missing_files.append(filename)
        
        # Download missing files
        # if missing_files:
        #     print(f"Missing model files: {missing_files}")
        #     for filename in missing_files:
        #         download_model_from_huggingface(filename, self.model_dir)
        
        # Load models after downloading
        try:
            self.rf_model = joblib.load(os.path.join(self.model_dir, 'rf_model.pkl'))
            self.ffnn_model = tf.keras.models.load_model(os.path.join(self.model_dir, 'ffnn_model.h5'))
            self.xgb_model = joblib.load(os.path.join(self.model_dir, 'xgb_model.pkl'))
            self.meta_model = joblib.load(os.path.join(self.model_dir, 'meta_model.pkl'))
            self.scaler = joblib.load(os.path.join(self.model_dir, 'scaler.pkl'))
            self.feature_columns = joblib.load(os.path.join(self.model_dir, 'feature_columns.pkl'))
            
            # Load risk thresholds if available, otherwise use defaults
            try:
                self.risk_thresholds = joblib.load(os.path.join(self.model_dir, 'risk_thresholds.pkl'))
            except:
                print("Using default risk thresholds")
        except Exception as e:
            raise Exception(f"Failed to load models: {e}")
    
    def predict(self, input_data, return_proba=False):
        # Ensure input data has all required features
        if isinstance(input_data, dict):
            # Convert dict to DataFrame with one row
            input_df = pd.DataFrame([input_data])
        elif isinstance(input_data, list):
            # Assume list of values in the same order as feature_columns
            if len(input_data) != len(self.feature_columns):
                raise ValueError(f"Expected {len(self.feature_columns)} features, got {len(input_data)}")
            input_dict = {col: val for col, val in zip(self.feature_columns, input_data)}
            input_df = pd.DataFrame([input_dict])
        else:
            raise ValueError("Input data must be a dictionary or a list")
        
        # Ensure all required columns are present
        for col in self.feature_columns:
            if col not in input_df.columns:
                raise ValueError(f"Missing required feature: {col}")
                
        # Ensure only using the required features and in the correct order
        input_df = input_df[self.feature_columns]
        
        # Scale the input
        input_scaled = self.scaler.transform(input_df)

        # Get predictions from each model
        rf_pred = self.rf_model.predict_proba(input_scaled)[:, 1]      # Prob kelas 1
        ffnn_pred = self.ffnn_model.predict(input_scaled).flatten()    # Prob kelas 1
        xgb_pred = self.xgb_model.predict_proba(input_scaled)[:, 1]    # Prob kelas 1

        # Create stacked predictions
        stacked_input = np.column_stack((rf_pred, ffnn_pred, xgb_pred))
        final_pred = self.meta_model.predict(stacked_input)
        final_proba = self.meta_model.predict_proba(stacked_input)[:, 1]

        # Risk level classification
        if final_proba[0] < self.risk_thresholds['low']:
            risk_level = "Low Risk"
        elif final_proba[0] < self.risk_thresholds['medium']:
            risk_level = "Medium Risk"
        else:
            risk_level = "High Risk"

        if return_proba:
            return {
                "prediction": int(final_pred[0]),
                "probability": float(final_proba[0]),
                "confidence": float(final_proba[0]) if final_pred[0] == 1 else float(1 - final_proba[0]),
                "risk_level": risk_level,
                "model_probabilities": {
                    "random_forest": float(rf_pred[0]),
                    "ffnn": float(ffnn_pred[0]),
                    "xgboost": float(xgb_pred[0])
                }
            }
        else:
            return risk_level


# === Inisialisasi FastAPI dan model ===
app = FastAPI()
load_dotenv()
# Tambahkan ini:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://heartpredict-two.vercel.app",
        "https://heartpredict.online"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=groq_api_key)

# Inisialisasi MongoDB Atlas
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["heart-disease"]
prediction_collection = db["PredictionResult"]
chat_collection = db["AIChat"]

# Initialize model predictor
model_predictor = HeartDiseasePredictor(model_dir='heart_disease_models')

# Definisi format input
class HeartDiseaseInput(BaseModel):
    HighBP: int
    HighChol: int
    CholCheck: int
    BMI: float
    Smoker: int                                     
    Stroke: int
    Diabetes: int
    PhysActivity: int
    Fruits: int
    Veggies: int
    HvyAlcoholConsump: int
    AnyHealthcare: int
    NoDocbcCost: int
    GenHlth: int
    MentHlth: int
    PhysHlth: int
    DiffWalk: int
    Sex: int
    Age: int
    Education: int
    Income: int
    
@app.get("/")
def read_root():
    return {"message": "Welcome to the Heart Disease Prediction API!"}
    
@app.post("/predict")
def predict(input_data: HeartDiseaseInput):
    try:
        data = input_data.model_dump()
        result = model_predictor.predict(data, return_proba=True)
        
        # Tambahkan prediksi label (Positive/Negative)
        result['prediction_label'] = "Positive" if result['prediction'] == 1 else "Negative"
        
        # Panggil LLM untuk memberikan saran
        advice = get_prevention_advice(data, result)
        result['advice'] = advice

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class ChatRequest(BaseModel):
    predictionResultId: str
    userMessage: str

# Endpoint POST /chat
@app.post("/chat")
async def chat_with_user(request: ChatRequest):
    try:
        prediction = get_prediction_from_mongo(request.predictionResultId)

        input_data = prediction["inputData"]
        prob_rf = prediction["modelProbabilities"]["random_forest"]
        prob_ffnn = prediction["modelProbabilities"]["ffnn"]
        prob_xgb = prediction["modelProbabilities"]["xgboost"]

        prompt = f"""
        Kamu adalah asisten medis cerdas. Berikut adalah data lengkap seorang pasien:

        **Informasi Pasien**
        - Tekanan Darah Tinggi (HighBP): {'Ya' if input_data['HighBP'] else 'Tidak'}
        - Kolesterol Tinggi (HighChol): {'Ya' if input_data['HighChol'] else 'Tidak'}
        - Pemeriksaan Kolesterol (CholCheck): {'Sudah' if input_data['CholCheck'] else 'Belum'}
        - BMI (Indeks Massa Tubuh): {input_data['BMI']}
        - Perokok (Smoker): {'Ya' if input_data['Smoker'] else 'Tidak'}
        - Riwayat Stroke: {'Ya' if input_data['Stroke'] else 'Tidak'}
        - Diabetes: {'Ya' if input_data['Diabetes'] else 'Tidak'}
        - Aktivitas Fisik: {'Aktif' if input_data['PhysActivity'] else 'Tidak Aktif'}
        - Konsumsi Buah: {'Ya' if input_data['Fruits'] else 'Tidak'}
        - Konsumsi Sayur: {'Ya' if input_data['Veggies'] else 'Tidak'}
        - Konsumsi Alkohol Berat: {'Ya' if input_data['HvyAlcoholConsump'] else 'Tidak'}
        - Memiliki Akses Kesehatan: {'Ya' if input_data['AnyHealthcare'] else 'Tidak'}
        - Tidak Pergi ke Dokter Karena Biaya (NoDocbcCost): {'Ya' if input_data['NoDocbcCost'] else 'Tidak'}
        - Kesehatan Umum (GenHlth): {input_data['GenHlth']} (semakin kecil = semakin sehat)
        - Kesehatan Mental (MentHlth): {input_data['MentHlth']}
        - Kesehatan Fisik (PhysHlth): {input_data['PhysHlth']}
        - Sulit Berjalan (DiffWalk): {'Ya' if input_data['DiffWalk'] else 'Tidak'}
        - Jenis Kelamin: {'Laki-laki' if input_data['Sex'] == 1 else 'Perempuan'}
        - Usia Kategori: {input_data['Age']} (semakin besar = semakin tua)
        - Pendidikan: {input_data['Education']} (1=sangat rendah, 6=sangat tinggi)
        - Pendapatan: {input_data['Income']} (1=sangat rendah, 8=sangat tinggi)

        **Hasil Prediksi**
        - Prediksi Akhir: {prediction['predictionLabel']}
        - Probabilitas: {round(prediction['probability'] * 100, 2)}%
        - Confidence (Keyakinan Model): {round(prediction['confidence'] * 100, 2)}%
        - Tingkat Risiko: {prediction['riskLevel']}

        **Probabilitas Model**
        - Random Forest: {round(prob_rf * 100, 2)}%
        - Feedforward Neural Network: {round(prob_ffnn * 100, 6)}%
        - XGBoost: {round(prob_xgb * 100, 2)}%

        *Pertanyaan Pengguna:**
        "{request.userMessage}"

        Berdasarkan semua data di atas, berikan jawaban yang **jelas, personal, dan bersahabat**, termasuk saran lanjutan atau klarifikasi jika dibutuhkan.
        
        """

        chat_completion = groq_client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "system", "content": "Kamu adalah dokter spesialis jantung terpintar di dunia ini."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            reasoning_format="hidden"
        )

        ai_response = chat_completion.choices[0].message.content

        return {"response": ai_response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint GET /chat
@app.get("/results")
def get_chats_by_prediction_id(prediction_id: str = Query(..., alias="predictionId")):
    try:
        chats = list(chat_collection.find({"predictionResultId": prediction_id}))

        for chat in chats:
            chat["_id"] = str(chat["_id"])  # Ubah ObjectId jadi string

        return {
            "predictionId": prediction_id,
            "count": len(chats),
            "chats": chats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ambil data prediksi langsung dari MongoDB
def get_prediction_from_mongo(pred_id: str):
    prediction = prediction_collection.find_one({"_id": pred_id})
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction result not found.")
    
    # Optional: konversi ObjectId ke string kalau perlu
    prediction["_id"] = str(prediction["_id"])
    return prediction

def get_prevention_advice(user_input, prediction_result):
    prompt = f"""
    Kamu adalah asisten medis. Berdasarkan data berikut:

    Data Pasien:
    {user_input}

    Hasil prediksi penyakit jantung: {prediction_result['prediction_label']} dengan probabilitas {prediction_result['probability']}

    Berikan saran pencegahan atau penanganan yang sesuai dan jelas.
    """

    chat_completion = groq_client.chat.completions.create(
        model="deepseek-r1-distill-llama-70b",
        messages=[
            {"role": "system", "content": "Kamu adalah dokter spesialis jantung terpintar di dunia ini."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        reasoning_format="hidden"
    )

    return chat_completion.choices[0].message.content

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
