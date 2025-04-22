from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from train_model import StackingHeartDiseaseModel
from dotenv import load_dotenv
from groq import Groq
import os
import requests

# === Fungsi download model dari Hugging Face ===
def download_model_if_missing():
    model_dir = "heart_disease_models"
    os.makedirs(model_dir, exist_ok=True)

    files = [
        "evaluation_metrics.pkl",
        "feature_columns.pkl",
        "ffnn_model.h5",
        "meta_model.pkl",
        "rf_model.pkl",
        "risk_thresholds.pkl",
        "scaler.pkl",
        "xgb_model.pkl"
    ]
    
    base_url = "https://huggingface.co/Agaam/heart-disease/tree/main/heart_disease_models"

    for filename in files:
        file_path = os.path.join(model_dir, filename)
        if not os.path.exists(file_path):
            print(f"📥 Downloading {filename}...")
            url = base_url + filename
            response = requests.get(url)
            if response.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(response.content)
            else:
                print(f"❌ Failed to download {filename}. Status code: {response.status_code}")


# === Inisialisasi FastAPI dan model ===
app = FastAPI()
load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=groq_api_key)

download_model_if_missing()

# Load model yang sudah dilatih
stacking = StackingHeartDiseaseModel(model_dir='heart_disease_models')
predict_fn = stacking.load_saved_models()

# Definisi format input - tanpa Education dan Income
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
        result = predict_fn(data, return_proba=True)
        
        # Tambahkan prediksi label (Positive/Negative)
        result['prediction'] = "Positive" if result['probability'] >= 0.5 else "Negative"
        
        # Panggil LLM untuk memberikan saran
        advice = get_prevention_advice(data, result)
        result['advice'] = advice

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_prevention_advice(user_input, prediction_result):
    prompt = f"""
    Kamu adalah asisten medis. Berdasarkan data berikut:

    Data Pasien:
    {user_input}

    Hasil prediksi penyakit jantung: {prediction_result['prediction']} dengan probabilitas {prediction_result['probability']}

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
    uvicorn.run(app, host="0.0.0.0", port=8000)
    



# @app.post("/predict")
# def predict(input_data: HeartDiseaseInput):
#     try:
#         # Konversi input ke dictionary
#         data = input_data.model_dump()
        
#         # Lakukan prediksi
#         result = predict_fn(data, return_proba=True)
        
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))