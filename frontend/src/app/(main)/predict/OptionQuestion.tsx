"use client";
import { ChevronDown, ChevronUp, Check, Loader2 } from "lucide-react";
import { useState } from "react";

const OptionQuestion = ({
  options,
  onAnswer,
  questionsLast,
}: {
  options: { label: string; value: number; description?: string }[];
  onAnswer: (value: number) => void;
  questionsLast?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<null | {
    label: string;
    value: number;
    description?: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (option: (typeof options)[0]) => {
    setSelected(option);
    setIsOpen(false);
    if (!questionsLast) {
      onAnswer(option.value); // langsung kirim kalau BUKAN pertanyaan terakhir
    }
  };

  const handleSubmit = () => {
    if (selected) {
      setLoading(true);
      onAnswer(selected.value);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Custom Dropdown */}
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-700/50 border border-slate-600/50 hover:border-pink-500/50 rounded-xl px-6 py-4 text-left flex justify-between items-center transition-all duration-300 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
        >
          <span
            className={`text-lg ${selected ? "text-white" : "text-gray-400"}`}
          >
            {selected ? selected.label : "Pilih salah satu opsi"}
          </span>
          <div className="flex items-center gap-2">
            {selected && (
              <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-500/30">
                <Check className="w-3 h-3 text-pink-400" />
              </div>
            )}
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="relative z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            <div className="p-2">
              {options.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="group cursor-pointer rounded-lg p-4 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500/20 group-hover:border-pink-500/40 transition-colors">
                          <span className="text-pink-400 font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="font-semibold text-white group-hover:text-pink-200 transition-colors">
                          {option.label}
                        </div>
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-400 mt-2 ml-11 group-hover:text-gray-300 transition-colors">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {selected?.value === option.value && (
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center ml-3">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Option Info */}
      {selected && (
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-500/30 flex-shrink-0">
              <Check className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold text-lg mb-2">
                Pilihan Anda: {selected.label}
              </h4>
              {selected.description && (
                <p className="text-gray-300 leading-relaxed">
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button for Last Question */}
      {questionsLast && selected && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group relative bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 disabled:shadow-none disabled:cursor-not-allowed min-w-[160px]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span>Submit & Analyze</span>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Option Grid Alternative (for fewer options) */}
      {options.length <= 4 && (
        <div className="mt-6">
          <p className="text-gray-400 text-sm mb-4">Atau pilih langsung:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`group text-left p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  selected?.value === option.value
                    ? "bg-pink-500/20 border-pink-500/50 shadow-pink-500/10"
                    : "bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                      selected?.value === option.value
                        ? "bg-pink-500/30 border-pink-500/50"
                        : "bg-slate-600/30 border-slate-500/50 group-hover:bg-slate-500/30"
                    }`}
                  >
                    {selected?.value === option.value ? (
                      <Check className="w-4 h-4 text-pink-400" />
                    ) : (
                      <span className="text-gray-400 font-bold text-sm">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-semibold transition-colors ${
                        selected?.value === option.value
                          ? "text-pink-200"
                          : "text-white group-hover:text-gray-200"
                      }`}
                    >
                      {option.label}
                    </div>
                    {option.description && (
                      <div
                        className={`text-sm mt-1 transition-colors ${
                          selected?.value === option.value
                            ? "text-pink-300/80"
                            : "text-gray-400 group-hover:text-gray-300"
                        }`}
                      >
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionQuestion;
