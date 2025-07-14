"use client";
import { deletePrediction } from "@/actions/delete-prediction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/user-current-session";
import { Prediction } from "@/types/prediction";
import {
  TreePine,
  Brain,
  Layers,
  Trash2,
  Eye,
  Calendar,
  User,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteDialogButton } from "@/components/DeleteDialogButton";

interface PredictionHistoryTabProps {
  predictions: Prediction[];
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  onViewResult?: (prediction: Prediction) => void;
}

export const PredictionHistoryTab = ({
  predictions,
  getStatusColor,
  getStatusIcon,
}: PredictionHistoryTabProps) => {
  const user = useCurrentUser();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const router = useRouter();

  const confirmDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deletePrediction(id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting prediction:", error);
      alert("Gagal menghapus prediksi. Silakan coba lagi.");
    } finally {
      setIsDeleting(null);
      setOpenDialogId(null); // Tutup dialog setelah selesai
    }
  };

  const handleRowClick = (prediction: Prediction) => {
    router.push(`/result/${prediction.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-slate-600/30 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Riwayat Prediksi
            </h3>
            <div className="ml-auto text-sm text-slate-400">
              {predictions.length} hasil
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block h-screen overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-800/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Pasien
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal & Waktu
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                  Random Forest
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                  Neural Network
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                  XGBoost
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                  Final Result
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {predictions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-slate-700/30 rounded-full">
                        <Calendar className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-400">
                        Belum ada prediksi yang tersimpan
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                predictions.map((prediction) => (
                  <tr
                    key={prediction.id}
                    className="hover:bg-slate-700/20 cursor-pointer transition-all duration-200 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="">
                          <Avatar className="cursor-pointer">
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt="User Avatar"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <AvatarFallback className="px-5 py-[0.4px] bg-white rounded-xs font-medium text-md text-black hover:bg-gray-500 transition duration-300 ease-in-out shadow-md active:scale-95">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {prediction.patientName}
                          </div>
                          <div className="text-sm text-slate-400">
                            {prediction.age}, {prediction.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-white font-medium">
                        {prediction.date}
                      </div>
                      <div className="text-sm text-slate-400">
                        {prediction.time}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <TreePine className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="text-lg font-bold text-white">
                          {(prediction.rfProbability * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">
                          Probabilitas
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <Brain className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-lg font-bold text-white">
                          {(prediction.nnProbability * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">
                          Probabilitas
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <Layers className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="text-lg font-bold text-white">
                          {(prediction.xgbProbability * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">
                          Probabilitas
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`flex flex-row items-center gap-2 px-3 py-2 rounded-full font-semibold text-sm ${getStatusColor(prediction.stackingPrediction)}`}
                        >
                          {getStatusIcon(prediction.stackingPrediction)}
                          {prediction.stackingPrediction}
                        </div>
                        <div className="text-sm text-slate-400">
                          Confidence:{" "}
                          {(prediction.stackingConfidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(prediction);
                          }}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <DeleteDialogButton
                          id={prediction.id}
                          onConfirm={() => confirmDelete(prediction.id)}
                          isDeleting={isDeleting === String(prediction.id)}
                          disabled={isDeleting === String(prediction.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Modern Design */}
        <div className="lg:hidden h-screen overflow-y-auto ">
          {predictions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <Smartphone className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    Belum ada prediksi
                  </h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    Prediksi yang tersimpan akan muncul di sini
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {predictions.map((prediction, index) => (
                <div
                  key={prediction.id}
                  className="group relative bg-gradient-to-br from-slate-950/10 to-slate-900/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-5 cursor-pointer transition-all duration-300 "
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-purple-900 to-transparent rounded-full"></div>

                  {/* Header with improved layout */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Avatar className="cursor-pointer ring-2 ring-slate-700/50 hover:ring-slate-600/50 transition-all duration-200">
                          {user?.image ? (
                            <AvatarImage
                              src={user.image}
                              alt="User Avatar"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-base truncate">
                          {prediction.patientName}
                        </div>
                        <div className="text-sm text-slate-400 flex items-center gap-1">
                          <span>{prediction.age}</span>
                          <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                          <span>{prediction.gender}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2  transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(prediction);
                        }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <DeleteDialogButton
                        id={prediction.id}
                        onConfirm={() => confirmDelete(prediction.id)}
                        isDeleting={isDeleting === String(prediction.id)}
                        disabled={isDeleting === String(prediction.id)}
                      />
                    </div>
                  </div>

                  {/* Date & Time with improved styling */}
                  <div className="flex items-center gap-2 mb-5 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 font-medium">
                        {prediction.date}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-medium">
                        {prediction.time}
                      </span>
                    </div>
                  </div>

                  {/* Model Results with modern cards */}
                  <div className="space-y-3">
                    {/* Individual Model Results */}
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-500/20 rounded-lg">
                              <TreePine className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <span className="text-sm font-medium text-green-400">
                              Random Forest
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {(prediction.rfProbability * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-500/20 rounded-lg">
                              <Brain className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            <span className="text-sm font-medium text-purple-400">
                              Neural Network
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {(prediction.nnProbability * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-500/20 rounded-lg">
                              <Layers className="w-3.5 h-3.5 text-orange-400" />
                            </div>
                            <span className="text-sm font-medium text-orange-400">
                              XGBoost
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {(prediction.xgbProbability * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final Result - Enhanced */}
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-xl p-4 mt-3">
                      <div className="text-center">
                        <div className="text-xs text-slate-400 mb-2 font-medium tracking-wide uppercase">
                          Final Result
                        </div>
                        <div className="flex items-center justify-center mb-2">
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(prediction.stackingPrediction)}`}
                          >
                            {getStatusIcon(prediction.stackingPrediction)}
                            {prediction.stackingPrediction}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">
                          {(prediction.stackingConfidence * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Confidence Level
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle bottom decoration */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent rounded-full"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
