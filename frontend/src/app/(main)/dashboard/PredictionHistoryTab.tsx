"use client";
import { Search, Filter, TreePine, Brain, Layers } from "lucide-react";

interface Prediction {
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
}

interface PredictionHistoryTabProps {
  predictions: Prediction[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  getStatusColor: (status: string) => string;
}

export const PredictionHistoryTab = ({
  predictions,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  getStatusColor,
}: PredictionHistoryTabProps) => {
  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch = prediction.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || prediction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Next Update Fitur*/}
      {/* <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama pasien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-600 bg-black text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* Predictions Table */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Riwayat Prediksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Random Forest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Neural Network
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Stacking Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 divide-y divide-gray-700">
              {filteredPredictions.map((prediction) => (
                <tr key={prediction.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {prediction.patientName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {prediction.age} tahun, {prediction.gender}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div>{prediction.date}</div>
                    <div className="text-gray-400">{prediction.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prediction.rfPrediction)}`}
                    >
                      <TreePine className="w-3 h-3 mr-1" />
                      {prediction.rfPrediction}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Confidence: {(prediction.rfConfidence * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prediction.nnPrediction)}`}
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      {prediction.nnPrediction}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Confidence: {(prediction.nnConfidence * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prediction.stackingPrediction)}`}
                    >
                      <Layers className="w-3 h-3 mr-1" />
                      {prediction.stackingPrediction}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Confidence:{" "}
                      {(prediction.stackingConfidence * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        prediction.status === "reviewed"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-yellow-900/50 text-yellow-400"
                      }`}
                    >
                      {prediction.status === "reviewed"
                        ? "Reviewed"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
