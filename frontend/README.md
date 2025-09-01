# 🩺 Prediksi Penyakit Jantung dengan Machine Learning

🔗 Live Demo: [https://www.heartpredict.online](https://www.heartpredict.online)

## 📌 Deskripsi

Project ini adalah aplikasi berbasis **Machine Learning** untuk memprediksi risiko penyakit jantung.
Selain prediksi, aplikasi ini juga dilengkapi dengan fitur **chat AI** untuk memberikan penjelasan hasil prediksi agar lebih mudah dipahami pengguna.

---

## 🚀 Fitur Utama

- ✅ Prediksi penyakit jantung berbasis ML
- ✅ Chat dengan AI untuk penjelasan hasil
- ✅ UI modern dengan Next.js & Tailwind
- ✅ Deployment menggunakan Google Cloud Platform (GCP)

---

## 🧠 Method Stack

- Random Forest
- Neural Network
- XGBoost
- Logistic Regression (Stacking)

---

## 💻 Tech Stack

**Frontend**

- Next.js
- Tailwind CSS

**Backend**

- FastAPI
- MongoDB + Prisma ORM
- NextAuth

**Machine Learning**

- TensorFlow
- Scikit-learn
- Pandas
- NumPy

**Deployment & Infrastruktur**

- Docker
- Google Cloud Platform (GCP)
- DeepSeek API (Groq Cloud)

---

## ⚙️ Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/heartpredict.git
cd heartpredict
```

### 2. Setup Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Setup Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### 4. Jalankan dengan Docker (opsional)

```bash
docker-compose up --build
```

---

## 📊 Alur Sistem

1. User mengisi form prediksi
2. Data diproses dan dikirim ke backend (FastAPI)
3. Model Machine Learning (Random Forest, Neural Network, XGBoost, Stacking) melakukan prediksi
4. Hasil prediksi + confidence ditampilkan ke user
5. User dapat bertanya ke AI (DeepSeek API) untuk penjelasan hasil

---

## 📌 Lisensi

MIT License © 2025
