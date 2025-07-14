"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Activity,
  FileText,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  MessageCircle,
} from "lucide-react";
import { logout } from "@/actions/logout";
import { OverviewTab } from "./OverviewTab";
import { PredictionHistoryTab } from "./PredictionHistoryTab";
import { ModelComparisonTab } from "./ModelComparisonTab";
import { ChatbotTab } from "./ChatBotTab";
import { useCurrentUser } from "@/hooks/user-current-session";
import { fetchPredictionResults } from "@/actions/fetch-prediction-result";
import { Prediction } from "@/types/prediction";
import { useSearchParams } from "next/navigation";
import {
  deleteUserAccountWithBackup,
  getUserDataStats,
} from "@/actions/delete-account";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  type UserStats = {
    user: {
      name: string | null;
      email: string | null;
      isTwoFactorEnabled: boolean;
    } | null;
    predictions: number;
    aiChats: number;
    connectedAccounts: number;
    totalDataPoints: number;
  };

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const rawData = await fetchPredictionResults();
      const data: Prediction[] = rawData.map((item: any) => ({
        ...item,
        patientName:
          typeof item.patientName === "string"
            ? item.patientName
            : item.patientName?.name || "",
      }));
      setPredictions(data);
    };
    getData();
  }, []);

  // Load user data statistics when component mounts
  useEffect(() => {
    const loadUserStats = async () => {
      if (user?.id) {
        setIsLoadingStats(true);
        try {
          const result = await getUserDataStats(user?.id);
          if (result.success) {
            setUserStats(result.data ?? null);
          }
        } catch (error) {
          console.error("Error loading user stats:", error);
        } finally {
          setIsLoadingStats(false);
        }
      }
    };

    loadUserStats();
  }, [user?.id]);

  const onClick = () => {
    logout();
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handler function for delete account
  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE ACCOUNT" || !user?.id) return;

    setIsDeleting(true);

    try {
      await deleteUserAccountWithBackup();
      logout(); // Logout setelah delete
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Terjadi kesalahan saat menghapus akun. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
      setConfirmText("");
    }
  };

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
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
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
          <div className="bg-gradient-to-br from-red-500/5 to-red-600/10 border border-red-500/20 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Hapus Akun
            </h3>

            <div className="space-y-6">
              {/* Warning Section */}
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-red-400 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2">
                      Peringatan Penting
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Tindakan ini tidak dapat dibatalkan. Menghapus akun akan
                      menghilangkan semua data Anda secara permanen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data yang akan dihapus */}
              <div>
                <h4 className="text-white font-medium mb-3">
                  Data yang akan dihapus:
                </h4>

                {userStats ? (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Informasi profil dan akun
                        </div>
                        <span className="text-red-400 font-medium">1 akun</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Hasil prediksi
                        </div>
                        <span className="text-red-400 font-medium">
                          {userStats.predictions} prediksi
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-gray-300">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Riwayat chat AI
                        </div>
                        <span className="text-red-400 font-medium">
                          {userStats.aiChats} pesan
                        </span>
                      </div>
                    </div>

                    {userStats.connectedAccounts > 0 && (
                      <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between text-gray-300">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2 text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            Akun terhubung (OAuth)
                          </div>
                          <span className="text-red-400 font-medium">
                            {userStats.connectedAccounts} akun
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 font-semibold">
                          Total data yang akan dihapus:
                        </span>
                        <span className="text-red-400 font-bold text-lg">
                          {userStats.totalDataPoints} item
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Informasi profil dan akun
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Semua hasil prediksi
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Riwayat chat AI
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Akun terhubung dan preferensi
                    </div>
                  </div>
                )}
              </div>

              {/* Konfirmasi */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Konfirmasi penghapusan akun
                </label>
                <p className="text-gray-300 text-sm mb-3">
                  Ketik "DELETE ACCOUNT" untuk mengonfirmasi bahwa Anda ingin
                  menghapus akun secara permanen.
                </p>
                <input
                  type="text"
                  placeholder="DELETE ACCOUNT"
                  className="w-full px-4 py-3 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={confirmText !== "DELETE ACCOUNT" || isDeleting}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                        confirmText === "DELETE ACCOUNT" && !isDeleting
                          ? "bg-red-600/50 hover:bg-red-700 text-white"
                          : "bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isDeleting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Menghapus Akun...
                        </div>
                      ) : (
                        "Delete Account"
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black text-white border border-red-600 rounded-lg shadow-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus akun?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Anda akan menghapus {userStats?.totalDataPoints || 0}{" "}
                        item data secara permanen. Tindakan ini tidak dapat
                        dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-red-500/20 cursor-pointer hover:bg-red-500/30 text-red-400 font-medium px-4 py-2 rounded-lg transition-all">
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className=" text-white font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isDeleting ? "Menghapus..." : "Lanjutkan"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-4 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2">
                  Alternatif Lain
                </h4>
                <p className="text-gray-300 text-sm">
                  Jika Anda hanya ingin berhenti menggunakan layanan untuk
                  sementara, Anda dapat logout dari akun tanpa menghapusnya.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
