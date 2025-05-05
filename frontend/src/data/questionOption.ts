// src/data/questionOptions.ts
export const questions = [
    {
      id: "HighBP",
      question: "Apakah memiliki tekanan darah tinggi?",
      type: "boolean",
    },
    {
      id: "HighChol",
      question: "Apakah memiliki kolesterol tinggi?",
      type: "boolean",
    },
    {
      id: "CholCheck",
      question:
        "Apakah Anda pernah melakukan cek kolesterol dalam 5 tahun terakhir?",
      type: "boolean",
    },
    {
      id: "BMI",
      question: "Berapa nilai BMI (Body Mass Index) Anda?",
      type: "bmi",
    },
    {
      id: "Smoker",
      question: "Apakah Anda seorang perokok aktif?",
      type: "boolean",
    },
    {
      id: "Stroke",
      question: "Apakah Anda pernah mengalami stroke?",
      type: "boolean",
    },
    {
      id: "Diabetes",
      question: "Apakah Anda menderita diabetes?",
      type: "diabetes",
    },
    {
      id: "PhysActivity",
      question: "Apakah Anda rutin melakukan aktivitas fisik?",
      type: "boolean",
    },
    {
      id: "Fruits",
      question: "Apakah Anda rutin mengonsumsi buah-buahan?",
      type: "boolean",
    },
    {
      id: "Veggies",
      question: "Apakah Anda rutin mengonsumsi sayuran?",
      type: "boolean",
    },
    {
      id: "HvyAlcoholConsump",
      question: "Apakah Anda mengonsumsi alkohol berat?",
      type: "boolean",
    },
    {
      id: "AnyHealthcare",
      question: "Apakah Anda memiliki akses ke layanan kesehatan?",
      type: "boolean",
    },
    {
      id: "NoDocbcCost",
      question: "Apakah Anda pernah tidak ke dokter karena alasan biaya?",
      type: "boolean",
    },
    {
      id: "GenHlth",
      question:
        "Bagaimana Anda menilai kondisi kesehatan Anda secara umum? (1 = Sangat Baik, 5 = Sangat Buruk)",
      type: "genHlth",
    },
    {
      id: "MentHlth",
      question:
        "Dalam sebulan terakhir, berapa hari Anda merasa kesehatan mental Anda buruk?",
      type: "number",
    },
    {
      id: "PhysHlth",
      question:
        "Dalam sebulan terakhir, berapa hari Anda merasa kesehatan fisik Anda buruk?",
      type: "number",
    },
    {
      id: "DiffWalk",
      question: "Apakah Anda mengalami kesulitan berjalan atau naik tangga?",
      type: "boolean",
    },
    {
      id: "Sex",
      question: "Apa jenis kelamin Anda? (1 = Laki-laki, 0 = Perempuan)",
      type: "sex"
    },
    {
      id: "Age",
      question: "Berapa usia Anda? (dalam rentang: 1-13, sesuai dataset)",
      type: "age",
    },
    {
      id: "Education",
      question:
        "Apa tingkat pendidikan terakhir Anda? (1 = Tidak Sekolah, 6 = Lulus Perguruan Tinggi)",
      type: "education"
    },
    {
      id: "Income",
      question:
        "Berapa tingkat pendapatan Anda? (1 = sangat rendah, 8 = sangat tinggi)",
      type: "income"
    }
  ];
export const diabetesOptions = [
    {
      label: "Tidak",
      value: 0,
      description: "Anda tidak menderita diabetes.",
    },
    {
      label: "Pra-diabetes",
      value: 1,
      description:
        "Anda telah didiagnosis pra-diabetes, yaitu kadar gula darah lebih tinggi dari normal namun belum tergolong diabetes.",
    },
    {
      label: "Diabetes",
      value: 2,
      description:
        "Anda telah didiagnosis menderita diabetes, baik tipe 1 maupun tipe 2.",
    },
  ];
  
export const genHealthOptions = [
    {
      label: "1 - Sangat Baik",
      value: 1,
      description: "Anda menilai kondisi kesehatan Anda sangat baik secara umum.",
    },
    {
      label: "2 - Baik",
      value: 2,
      description: "Anda menilai kondisi kesehatan Anda baik secara umum.",
    },
    {
      label: "3 - Cukup",
      value: 3,
      description:
        "Anda menilai kondisi kesehatan Anda cukup, tidak terlalu baik atau buruk.",
    },
    {
      label: "4 - Buruk",
      value: 4,
      description: "Anda menilai kondisi kesehatan Anda cukup buruk secara umum.",
    },
    {
      label: "5 - Sangat Buruk",
      value: 5,
      description: "Anda menilai kondisi kesehatan Anda sangat buruk secara umum.",
    },
  ];
  
export const sexOptions = [
    {
      label: "Perempuan",
      value: 0
    },
    {
      label: "laki-laki",
      value: 1
    }
  ];
  
export const ageOptions = [
    {
      label: "18-24 tahun",
      value: 1,
      description: "Anda berada dalam kelompok usia muda (18–24 tahun).",
    },
    {
      label: "25-29 tahun",
      value: 2,
      description: "Usia dewasa awal (25–29 tahun).",
    },
    {
      label: "30-34 tahun",
      value: 3,
      description: "Usia dewasa awal (30–34 tahun).",
    },
    {
      label: "35-39 tahun",
      value: 4,
      description: "Usia dewasa awal (35–39 tahun).",
    },
    {
      label: "40-44 tahun",
      value: 5,
      description: "Usia dewasa menengah (40–44 tahun).",
    },
    {
      label: "45-49 tahun",
      value: 6,
      description: "Usia dewasa menengah (45–49 tahun).",
    },
    {
      label: "50-54 tahun",
      value: 7,
      description: "Usia menjelang lanjut (50–54 tahun).",
    },
    {
      label: "55-59 tahun",
      value: 8,
      description: "Usia menjelang lanjut (55–59 tahun).",
    },
    {
      label: "60-64 tahun",
      value: 9,
      description: "Usia lanjut awal (60–64 tahun).",
    },
    {
      label: "65-69 tahun",
      value: 10,
      description: "Usia lanjut (65–69 tahun).",
    },
    {
      label: "70-74 tahun",
      value: 11,
      description: "Usia lanjut (70–74 tahun).",
    },
    {
      label: "75-79 tahun",
      value: 12,
      description: "Usia lanjut (75–79 tahun).",
    },
    {
      label: "80 tahun ke atas",
      value: 13,
      description: "Usia sangat lanjut (80 tahun ke atas).",
    },
  ];

export const educationOptions = [
    {
      label: "1 - Tidak Sekolah",
      value: 1,
      description: "Anda tidak pernah mengenyam pendidikan formal.",
    },
    {
      label: "2 - SD",
      value: 2,
      description: "Pendidikan terakhir Anda adalah Sekolah Dasar (SD).",
    },
    {
      label: "3 - SMP",
      value: 3,
      description: "Pendidikan terakhir Anda adalah Sekolah Menengah Pertama (SMP).",
    },
    {
      label: "4 - SMA",
      value: 4,
      description: "Pendidikan terakhir Anda adalah Sekolah Menengah Atas (SMA).",
    },
    {
      label: "5 - Diploma/Sarjana Muda",
      value: 5,
      description: "Anda lulus program Diploma atau Sarjana Muda.",
    },
    {
      label: "6 - Sarjana/Pascasarjana",
      value: 6,
      description: "Anda lulus dari jenjang Sarjana atau lebih tinggi.",
    },
  ];
  
export const incomeOptions = [
    {
      label: "< $10.000",
      value: 1,
      description: "Pendapatan sangat rendah, kurang dari $10.000 per tahun.",
    },
    {
      label: "$10.000 – $15.000",
      value: 2,
      description: "Pendapatan rendah, antara $10.000 hingga $15.000 per tahun.",
    },
    {
      label: "$15.000 – $20.000",
      value: 3,
      description: "Pendapatan rendah-menengah, antara $15.000 hingga $20.000.",
    },
    {
      label: "$20.000 – $25.000",
      value: 4,
      description: "Pendapatan menengah ke bawah, antara $20.000 hingga $25.000.",
    },
    {
      label: "$25.000 – $35.000",
      value: 5,
      description: "Pendapatan menengah, antara $25.000 hingga $35.000 per tahun.",
    },
    {
      label: "$35.000 – $50.000",
      value: 6,
      description: "Pendapatan menengah ke atas, antara $35.000 hingga $50.000.",
    },
    {
      label: "$50.000 – $75.000",
      value: 7,
      description: "Pendapatan tinggi, antara $50.000 hingga $75.000 per tahun.",
    },
    {
      label: "≥ $75.000",
      value: 8,
      description: "Pendapatan sangat tinggi, lebih dari $75.000 per tahun.",
    },
  ];
  