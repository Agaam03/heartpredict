import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Bot,
  User,
  Send,
  MessageCircle,
  Activity,
  Brain,
  History,
  Loader,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getAndSaveAiChat } from "@/actions/save-ai-chat";
import { Prediction } from "@/types/prediction";

type ChatMessage = {
  _id?: string;
  id?: number;
  type: "user" | "bot";
  message: string | null;
  timestamp: string;
  userMessage?: string;
  aiResponse?: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPredictionId, setCurrentPredictionId] = useState(
    predictions[0]?.id || ""
  );
  const searchParams = useSearchParams();
  const idFromParams = searchParams.get("id");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  // Fetch chat history
  const fetchChatHistory = async (predictionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/results?predictionId=${predictionId}`
      );
      const data = await response.json();

      if (data.chats && data.chats.length > 0) {
        const formattedMessages = data.chats.flatMap((chat: any) => [
          {
            id: chat._id + "_user",
            type: "user" as const,
            message: chat.userMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
          {
            id: chat._id + "_bot",
            type: "bot" as const,
            message: chat.aiResponse,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        setChatMessages([
          {
            id: 1,
            type: "bot",
            message:
              "Halo! Saya adalah AI Assistant untuk CardioPredict yang didukung oleh DeepSeek AI. Saya dapat membantu Anda memahami hasil prediksi penyakit jantung, menjelaskan metode yang digunakan, dan memberikan rekomendasi medis. Ada yang ingin Anda tanyakan?",
            timestamp: new Date().toLocaleTimeString(),
          },
          ...formattedMessages,
        ]);
        setChatHistory(data.chats);
      } else {
        // Initialize with welcome message only
        setChatMessages([
          {
            id: 1,
            type: "bot",
            message:
              "Halo! Saya adalah AI Assistant untuk CardioPredict yang didukung oleh DeepSeek AI. Saya dapat membantu Anda memahami hasil prediksi penyakit jantung, menjelaskan metode yang digunakan, dan memberikan rekomendasi medis. Ada yang ingin Anda tanyakan?",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatMessages([
        {
          id: 1,
          type: "bot",
          message:
            "Maaf, terjadi kesalahan saat mengambil riwayat chat. Silakan coba lagi.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    if (currentPredictionId) {
      fetchChatHistory(currentPredictionId);
    }
  }, [currentPredictionId]);

  // Set initial slide based on currentPredictionId
  useEffect(() => {
    if (predictions.length > 0) {
      const initialSlide = predictions.findIndex(
        (p) => p.id === currentPredictionId
      );
      if (initialSlide !== -1) {
        setCurrentSlide(initialSlide);
      }
    }
  }, [predictions, currentPredictionId]);

  // Jalankan otomatis saat chatbot tab dibuka dan ada id di URL
  useEffect(() => {
    if (idFromParams && predictions.length > 0) {
      const index = predictions.findIndex((p) => p.id === idFromParams);
      if (index !== -1) {
        handlePredictionChange(idFromParams, index);
      }
    }
  }, [idFromParams, predictions]);

  // Cegah pemanggilan ulang jika sudah set sebelumnya
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && idFromParams && predictions.length > 0) {
      const index = predictions.findIndex((p) => p.id === idFromParams);
      if (index !== -1) {
        handlePredictionChange(idFromParams, index);
        setInitialized(true);
      }
    }
  }, [idFromParams, predictions]);

  // Handle prediction change
  const handlePredictionChange = (predictionId: string, slideIndex: number) => {
    setCurrentSlide(slideIndex);
    if (setCurrentPredictionId) {
      setCurrentPredictionId(predictionId);
    }
    // Fetch new chat history for this prediction
    fetchChatHistory(predictionId);
  };

  // Swiper navigation
  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % predictions.length;
    handlePredictionChange(predictions[newSlide].id, newSlide);
  };

  const prevSlide = () => {
    const newSlide =
      currentSlide === 0 ? predictions.length - 1 : currentSlide - 1;
    handlePredictionChange(predictions[newSlide].id, newSlide);
  };

  const goToSlide = (index: number) => {
    handlePredictionChange(predictions[index].id, index);
  };

  const handleChatSubmit = async (e: any) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const currentMessage = chatInput;
    setChatInput("");
    setIsTyping(true);

    try {
      const aiResponse = await getAndSaveAiChat(
        currentPredictionId,
        currentMessage
      );

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message:
          typeof aiResponse === "string"
            ? aiResponse
            : (aiResponse?.aiResponse ?? "Maaf, terjadi kesalahan."),
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickTopic = async (topic: string, id?: string) => {
    setChatInput(topic);
    // Auto-submit the quick topic
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      message: topic,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await getAndSaveAiChat(currentPredictionId, topic);

      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message:
          typeof aiResponse === "string"
            ? aiResponse
            : (aiResponse?.aiResponse ?? "Maaf, terjadi kesalahan."),
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
      {/* Chat Interface */}
      <div className="lg:col-span-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg flex flex-col h-screen">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  AI Doctor Assistant
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h3>
                <p className="text-sm text-gray-400">
                  Powered by DeepSeek AI • Konsultasi hasil prediksi
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchChatHistory(currentPredictionId)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                title="Refresh Chat"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                title="Chat History"
              >
                <History className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="ml-2 text-gray-400">
                Loading chat history...
              </span>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex space-x-3 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700"
                        : "bg-gradient-to-br from-green-600 to-emerald-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                        : "bg-gradient-to-br from-gray-700/50 to-gray-600/50 text-gray-100 border border-gray-600/50"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/50 rounded-lg p-3">
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
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit(e as any);
                }
              }}
              placeholder="Tanyakan tentang hasil prediksi..."
              className="flex-1 px-4 py-3 bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isTyping}
            />
            <button
              onClick={(e) => handleChatSubmit(e as any)}
              disabled={!chatInput.trim() || isTyping}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Chat History Toggle */}
        {showHistory && (
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Riwayat Chat
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {chatHistory.length > 0 ? (
                chatHistory.map((chat, index) => (
                  <div
                    key={chat._id}
                    className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30"
                  >
                    <div className="text-sm">
                      <p className="text-blue-300 font-medium mb-1">
                        Q: {chat.userMessage}
                      </p>
                      <p className="text-gray-300 text-xs line-clamp-2">
                        A: {chat.aiResponse.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  Belum ada riwayat chat
                </p>
              )}
            </div>
          </div>
        )}

        {/* Patient History Carousel */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-400" />
              Histori Prediksi
            </h4>
            <div className="text-sm text-gray-400">
              {currentSlide + 1} / {predictions.length}
            </div>
          </div>
          {predictions.length > 0 && (
            <div className="space-y-4">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {predictions.map((prediction, index) => (
                    <div key={prediction.id} className="w-full flex-shrink-0">
                      <div className="space-y-3">
                        {/* Patient Info */}
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === currentSlide
                                ? "bg-gradient-to-br from-emerald-600 to-emerald-700"
                                : "bg-gradient-to-br from-gray-600 to-gray-700"
                            }`}
                          >
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">
                              {prediction.patientName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {prediction.age}, {prediction.gender}
                            </p>
                          </div>
                        </div>

                        {/* Prediction Results */}
                        <div className="bg-gray-700/25 p-3 rounded-lg border border-gray-600/30">
                          <div className="space-y-2">
                            {/* Model Probabilities - Compact Layout */}
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">RF:</span>
                                <span className="text-blue-400 font-medium">
                                  {(prediction.rfProbability * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">NN:</span>
                                <span className="text-purple-400 font-medium">
                                  {(prediction.nnProbability * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">XGB:</span>
                                <span className="text-orange-400 font-medium">
                                  {(prediction.xgbProbability * 100).toFixed(0)}
                                  %
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">Stack:</span>
                                <span className="text-cyan-400 font-medium">
                                  {(
                                    prediction.stackingConfidence * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-600/50"></div>

                            {/* Final Result */}
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">
                                Final Result:
                              </span>
                              <span
                                className={`text-sm font-semibold px-2 py-1 rounded ${
                                  prediction.finalResult === "High Risk"
                                    ? "text-red-300 bg-red-500/20"
                                    : prediction.finalResult === "Medium Risk"
                                      ? "text-yellow-300 bg-yellow-500/20"
                                      : "text-green-300 bg-green-500/20"
                                }`}
                              >
                                {prediction.finalResult}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() =>
                            handleQuickTopic(
                              `Jelaskan hasil prediksi untuk pasien ${prediction.patientName}`
                            )
                          }
                          className={`w-full py-2 rounded-lg text-xs font-medium transition-all shadow-lg hover:shadow-xl cursor-pointer ${
                            index === currentSlide
                              ? "bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                              : "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-gray-300"
                          }`}
                          disabled={isTyping}
                        >
                          {index === currentSlide
                            ? "Diskusikan Hasil Ini"
                            : "Pilih Pasien"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              {predictions.length > 1 && (
                <div className="flex items-center justify-between">
                  {/* Previous/Next Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={prevSlide}
                      className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-300" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>

                  {/* Dot Indicators */}
                  <div className="flex space-x-1">
                    {predictions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                          index === currentSlide
                            ? "bg-emerald-400"
                            : "bg-gray-600 hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {predictions.length === 0 && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Belum ada data prediksi</p>
            </div>
          )}
        </div>

        {/* Quick Topics */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-400" />
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
                onClick={() => handleQuickTopic(topic)}
                className="w-full text-left p-3 bg-gradient-to-br from-gray-700/30 to-gray-600/30 border border-gray-600/50 hover:from-blue-600/20 hover:to-blue-700/20 hover:border-blue-500/50 text-gray-200 rounded-lg text-sm transition-all cursor-pointer"
                disabled={isTyping}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
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
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-white font-medium">Powered by DeepSeek</p>
                <p className="text-sm text-gray-400">
                  AI terdepan untuk analisis medis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
