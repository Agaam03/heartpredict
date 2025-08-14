"use client";
import { Heart, Activity, TrendingUp, FileText } from "lucide-react";
import { ClipLoader } from "react-spinners";

interface OverviewTabProps {
  predictions: {
    id: string;
    patientName: string;
    age: number;
    gender: string;
    date: string;
    time: string;
    finalResult: string;
  }[];
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export const OverviewTab = ({
  predictions,
  getStatusColor,
  getStatusIcon,
}: OverviewTabProps) => {
  const stats = {
    totalPredictions: predictions?.length || 0,
    highRisk:
      predictions?.filter((p) => p.finalResult === "Berisiko Tinggi").length ||
      0,
    mediumRisk:
      predictions?.filter((p) => p.finalResult === "Berisiko Sedang").length ||
      0,
    lowRisk:
      predictions?.filter((p) => p.finalResult === "Berisiko Rendah").length ||
      0,
    accuracy: 94.8,
  };

  // kondisi loading
  if (!predictions || predictions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={35} />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Total Prediksi
              </p>
              <p className="text-2xl font-bold text-white">
                {stats.totalPredictions}
              </p>
            </div>
            <div className="bg-blue-900/50 p-3 rounded-full">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Risiko Tinggi</p>
              <p className="text-2xl font-bold text-white">{stats.highRisk}</p>
            </div>
            <div className="bg-red-900/50 p-3 rounded-full">
              <Activity className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Risiko Sedang</p>
              <p className="text-2xl font-bold text-white">
                {stats.mediumRisk}
              </p>
            </div>
            <div className="bg-yellow-900/50 p-3 rounded-full">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Akurasi Model</p>
              <p className="text-2xl font-bold text-white">{stats.accuracy}%</p>
            </div>
            <div className="bg-green-900/50 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Predictions */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Prediksi Terbaru
        </h3>
        <div className="space-y-3">
          {predictions.slice(0, 3).map((prediction) => (
            <div
              key={prediction.id}
              className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {prediction.patientName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {prediction.date} - {prediction.time}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prediction.finalResult)}`}
              >
                {getStatusIcon(prediction.finalResult)}
                <span>{prediction.finalResult}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
