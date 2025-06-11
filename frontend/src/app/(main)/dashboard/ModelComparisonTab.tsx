"use client";
import { TreePine, Brain, Layers, Zap, BarChart3 } from "lucide-react";

interface ModelComparisonTabProps {
  stats: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
}

export const ModelComparisonTab = ({ stats }: ModelComparisonTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Random Forest Performance */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-900/50 p-2 rounded-lg">
              <TreePine className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Random Forest</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Akurasi</span>
              <span className="font-semibold text-white">92.5%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "92.5%" }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">95.2%</p>
                <p className="text-sm text-gray-400">Precision</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">89.8%</p>
                <p className="text-sm text-gray-400">Recall</p>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Network Performance */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-900/50 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Neural Network</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Akurasi</span>
              <span className="font-semibold text-white">93.8%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: "93.8%" }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">93.1%</p>
                <p className="text-sm text-gray-400">Precision</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">94.5%</p>
                <p className="text-sm text-gray-400">Recall</p>
              </div>
            </div>
          </div>
        </div>

        {/* XGBoost Performance */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-900/50 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">XGBoost</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Akurasi</span>
              <span className="font-semibold text-white">93.5%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: "93.5%" }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">94.7%</p>
                <p className="text-sm text-gray-400">Precision</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">92.1%</p>
                <p className="text-sm text-gray-400">Recall</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stacking Model Performance */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-900/50 p-2 rounded-lg">
            <Layers className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Stacking Meta Model
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Akurasi</span>
            <span className="font-semibold text-white">94.8%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: "94.8%" }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">96.3%</p>
              <p className="text-sm text-gray-400">Precision</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">93.2%</p>
              <p className="text-sm text-gray-400">Recall</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Architecture */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Arsitektur Stacking Model
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-blue-400">Base Models (Level 0)</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <TreePine className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Random Forest</p>
                  <p className="text-sm text-gray-400">
                    100 Decision Trees (Bagging), Random State: 42
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">
                    Feed Forward Neural Network
                  </p>
                  <p className="text-sm text-gray-400">
                    3 Hidden Layers [32-ReLU, 16-ReLU, 1-Sigmoid]
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white font-medium">XGBoost</p>
                  <p className="text-sm text-gray-400">
                    Gradient Boosted Trees, Logloss, Random State: 42
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-blue-400">Meta Model (Level 1)</h4>
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-white font-medium">Logistic Regression</p>
                <p className="text-sm text-gray-400">
                  Combines predictions from base models
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-800">
              <p className="text-blue-400 text-sm font-medium mb-2">
                Keunggulan Stacking:
              </p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Menggabungkan kekuatan RF, FFNN, dan XGBoost</li>
                <li>• Mengurangi bias dan variance</li>
                <li>• Meningkatkan akurasi dan generalisasi</li>
                <li>• Lebih robust terhadap overfitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison Next-Updated*/}
      {/* <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Perbandingan Performa Model
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-800">
            <h4 className="font-medium text-red-400 mb-2">Risiko Tinggi</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Random Forest</span>
                <span className="font-medium text-white">{stats.highRisk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Neural Network</span>
                <span className="font-medium text-white">{stats.highRisk}</span>
              </div>
              <div className="flex justify-between border-t border-red-800 pt-2">
                <span className="text-sm text-blue-400">Stacking Model</span>
                <span className="font-medium text-blue-400">
                  {stats.highRisk}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800">
            <h4 className="font-medium text-yellow-400 mb-2">Risiko Sedang</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Random Forest</span>
                <span className="font-medium text-white">
                  {stats.mediumRisk}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Neural Network</span>
                <span className="font-medium text-white">
                  {stats.mediumRisk}
                </span>
              </div>
              <div className="flex justify-between border-t border-yellow-800 pt-2">
                <span className="text-sm text-blue-400">Stacking Model</span>
                <span className="font-medium text-blue-400">
                  {stats.mediumRisk}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-800">
            <h4 className="font-medium text-green-400 mb-2">Risiko Rendah</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Random Forest</span>
                <span className="font-medium text-white">{stats.lowRisk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Neural Network</span>
                <span className="font-medium text-white">{stats.lowRisk}</span>
              </div>
              <div className="flex justify-between border-t border-green-800 pt-2">
                <span className="text-sm text-blue-400">Stacking Model</span>
                <span className="font-medium text-blue-400">
                  {stats.lowRisk}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
