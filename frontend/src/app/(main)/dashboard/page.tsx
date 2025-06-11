"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Activity,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Brain,
  TreePine,
  MessageCircle,
  Send,
  Bot,
  User,
  Layers,
  Zap,
} from "lucide-react";
import { logout } from "@/actions/logout";
import { OverviewTab } from "./OverviewTab";
import { PredictionHistoryTab } from "./PredictionHistoryTab";
import { ModelComparisonTab } from "./ModelComparisonTab";
import { ChatbotTab } from "./ChatBotTab";
import { useCurrentUser } from "@/hooks/user-current-session";

const Dashboard = () => {
  const user = useCurrentUser();
  const [activeTab, setActiveTab] = useState("overview");
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

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample data - replace with actual API calls
  useEffect(() => {
    const samplePredictions = [
      {
        id: 1,
        patientName: "Ahmad Santoso",
        age: 45,
        gender: "Laki-laki",
        date: "2025-06-05",
        time: "14:30",
        rfPrediction: "Berisiko Tinggi",
        nnPrediction: "Berisiko Tinggi",
        stackingPrediction: "Berisiko Tinggi",
        rfConfidence: 0.87,
        nnConfidence: 0.92,
        stackingConfidence: 0.94,
        finalResult: "Berisiko Tinggi",
        status: "reviewed",
      },
      {
        id: 2,
        patientName: "Siti Rahmawati",
        age: 52,
        gender: "Perempuan",
        date: "2025-06-04",
        time: "09:15",
        rfPrediction: "Berisiko Rendah",
        nnPrediction: "Berisiko Sedang",
        stackingPrediction: "Berisiko Sedang",
        rfConfidence: 0.73,
        nnConfidence: 0.68,
        stackingConfidence: 0.78,
        finalResult: "Berisiko Sedang",
        status: "pending",
      },
      {
        id: 3,
        patientName: "Budi Hartono",
        age: 38,
        gender: "Laki-laki",
        date: "2025-06-03",
        time: "16:45",
        rfPrediction: "Berisiko Rendah",
        nnPrediction: "Berisiko Rendah",
        stackingPrediction: "Berisiko Rendah",
        rfConfidence: 0.89,
        nnConfidence: 0.85,
        stackingConfidence: 0.91,
        finalResult: "Berisiko Rendah",
        status: "reviewed",
      },
    ];
    setPredictions(samplePredictions);
  }, []);

  const onClick = () => {
    logout();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Berisiko Tinggi":
        return "text-red-400 bg-red-900/50";
      case "Berisiko Sedang":
        return "text-yellow-400 bg-yellow-900/50";
      case "Berisiko Rendah":
        return "text-green-400 bg-green-900/50";
      default:
        return "text-gray-400 bg-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Berisiko Tinggi":
        return <XCircle className="w-4 h-4" />;
      case "Berisiko Sedang":
        return <AlertTriangle className="w-4 h-4" />;
      case "Berisiko Rendah":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch = prediction.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || prediction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalPredictions: predictions.length,
    highRisk: predictions.filter((p) => p.finalResult === "Berisiko Tinggi")
      .length,
    mediumRisk: predictions.filter((p) => p.finalResult === "Berisiko Sedang")
      .length,
    lowRisk: predictions.filter((p) => p.finalResult === "Berisiko Rendah")
      .length,
    accuracy: 94.8,
  };

  return (
    <div className=" bg-black">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between  py-4 space-y-4 sm:space-y-0">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3 sm:text-left justify-between sm:justify-start">
              <div className="flex items-center space-x-2">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    CardioPredict AI
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Sistem Prediksi Penyakit Jantung
                  </p>
                </div>
              </div>
              <button
                onClick={onClick}
                className="flex flex-row items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm md:hidden"
              >
                <LogOut className="w-4 h-4" />
                <span className="sm:inline">Keluar</span>
              </button>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center justify-start space-x-3 sm:space-x-4 ">
              <div className="lg:text-right text-left">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={onClick}
                className="sm:flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm hidden "
              >
                <LogOut className="w-4 h-4" />
                <span className="sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between lg:justify-normal space-x-6 sm:space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "history", label: "Riwayat Prediksi", icon: FileText },
              { id: "comparison", label: "Perbandingan Model", icon: PieChart },
              { id: "chatbot", label: "AI Doctor", icon: MessageCircle },
              { id: "settings", label: "Pengaturan", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center sm:space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600 cursor-pointer"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            predictions={predictions}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}
        {activeTab === "history" && (
          <PredictionHistoryTab
            predictions={predictions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            getStatusColor={getStatusColor}
          />
        )}
        {activeTab === "comparison" && (
          <ModelComparisonTab
            stats={{
              highRisk: stats.highRisk,
              mediumRisk: stats.mediumRisk,
              lowRisk: stats.lowRisk,
            }}
          />
        )}
        {activeTab === "chatbot" && (
          <ChatbotTab
            predictions={predictions}
            getStatusColor={getStatusColor}
          />
        )}
        {activeTab === "settings" && (
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Pengaturan Sistem
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-2">
                  Model Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Random Forest Trees
                    </label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-3 py-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Neural Network Layers
                    </label>
                    <input
                      type="number"
                      defaultValue="3"
                      className="w-full px-3 py-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20  text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">
                  Notification Settings
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-gray-300">
                      Email alerts for high-risk predictions
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-gray-300">Daily summary reports</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-gray-300">
                      Model performance notifications
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Simpan Pengaturan
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Reset ke Default
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
