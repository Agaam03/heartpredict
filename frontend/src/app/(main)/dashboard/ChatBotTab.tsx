import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Bot,
  User,
  Send,
  MessageCircle,
  Activity,
  Brain,
} from "lucide-react";

type Prediction = {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  rfPrediction: string;
  nnPrediction: string;
  stackingPrediction: string;
  rfConfidence: number;
  nnConfidence: number;
  stackingConfidence: number;
  finalResult: string;
  status: string;
};

type ChatMessage = {
  id: number;
  type: "user" | "bot";
  message: string;
  timestamp: string;
};

interface ChatbotTabProps {
  predictions: Prediction[];
  getStatusColor: (status: string) => string;
}

export const ChatbotTab: React.FC<ChatbotTabProps> = ({
  predictions,
  getStatusColor,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    setChatMessages([
      {
        id: 1,
        type: "bot",
        message:
          "Halo! Saya adalah AI Assistant untuk CardioPredict. Saya dapat membantu Anda memahami hasil prediksi penyakit jantung, menjelaskan metode yang digunakan, dan memberikan rekomendasi medis. Ada yang ingin Anda tanyakan?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  interface HandleChatSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  interface UserChatMessage extends ChatMessage {
    type: "user";
  }

  interface BotChatMessage extends ChatMessage {
    type: "bot";
  }

  const handleChatSubmit = async (e: HandleChatSubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: UserChatMessage = {
      id: Date.now(),
      type: "user",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: string[] = [
        "Berdasarkan hasil prediksi, pasien dengan risiko tinggi memerlukan evaluasi medis segera. Faktor-faktor seperti tekanan darah, kolesterol, dan riwayat keluarga sangat berpengaruh.",
        "Model stacking yang kami gunakan menggabungkan Random Forest dan Neural Network untuk akurasi yang lebih tinggi. Confidence level di atas 90% menunjukkan prediksi yang sangat andal.",
        "Untuk pasien dengan risiko sedang, saya merekomendasikan monitoring rutin dan perubahan gaya hidup seperti diet sehat dan olahraga teratur.",
        "Metode ensemble learning yang kami terapkan meningkatkan akurasi prediksi hingga 94.8%. Setiap model memberikan perspektif yang berbeda namun saling melengkapi.",
        "Hasil prediksi menunjukkan pola yang konsisten. Pastikan untuk konsultasi dengan dokter spesialis jantung untuk tindak lanjut yang tepat.",
      ];

      const botMessage: BotChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-900/50 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                AI Doctor Assistant
              </h3>
              <p className="text-sm text-gray-400">
                Konsultasi hasil prediksi dengan AI
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex space-x-3 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-6 h-6  rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-5 h-5  text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-950 text-white"
                      : "bg-gray-700/35 text-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-gray-700">
          <form onSubmit={handleChatSubmit} className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tanyakan tentang hasil prediksi..."
              className="flex-1 px-4 py-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20  text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Topics & Patient Info */}
      <div className="space-y-6">
        {/* Quick Topics */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Topik Populer
          </h4>
          <div className="space-y-2">
            {[
              "Apa arti hasil risiko tinggi?",
              "Bagaimana cara menurunkan risiko?",
              "Penjelasan confidence level",
              "Akurasi model stacking",
              "Faktor risiko utama",
              "Rekomendasi tindak lanjut",
            ].map((topic, index) => (
              <button
                key={index}
                onClick={() => setChatInput(topic)}
                className="w-full text-left p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/60 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Latest Patient Info */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Pasien Terakhir
          </h4>
          {predictions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {predictions[0].patientName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {predictions[0].age} tahun, {predictions[0].gender}
                  </p>
                </div>
              </div>
              <div className="bg-gray-700/25 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">RF:</span>
                    <span
                      className={`ml-2 ${getStatusColor(predictions[0].rfPrediction).split(" ")[0]}`}
                    >
                      {predictions[0].rfPrediction}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">NN:</span>
                    <span
                      className={`ml-2 ${getStatusColor(predictions[0].nnPrediction).split(" ")[0]}`}
                    >
                      {predictions[0].nnPrediction}
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-gray-600">
                    <span className="text-gray-400">Final:</span>
                    <span
                      className={`ml-2 font-medium ${getStatusColor(predictions[0].finalResult).split(" ")[0]}`}
                    >
                      {predictions[0].finalResult}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  setChatInput(
                    `Jelaskan hasil prediksi untuk pasien ${predictions[0].patientName}`
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors"
              >
                Diskusikan Hasil Ini
              </button>
            </div>
          )}
        </div>

        {/* AI Capabilities */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Kemampuan AI
          </h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Analisis Hasil</p>
                <p className="text-sm text-gray-400">
                  Menjelaskan detail prediksi model
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Rekomendasi Medis</p>
                <p className="text-sm text-gray-400">
                  Saran tindak lanjut yang tepat
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Penjelasan Model</p>
                <p className="text-sm text-gray-400">
                  Detail cara kerja algoritma
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
