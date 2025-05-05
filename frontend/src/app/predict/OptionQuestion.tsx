"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FadeLoader } from "react-spinners";

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
  const [loading, setLoading] = useState(false); // default false

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
    <>
      <div className="text-white flex flex-col w-full px-10 py-8 rounded-xl ">
        <div className="relative w-full max-w-xl">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full border border-pink-800 px-4 py-2 rounded bg-transparent text-left flex justify-between items-center hover:bg-pink-900 transition"
          >
            {selected ? selected.label : "Select an option"}
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-black border border-pink-800 rounded shadow-md max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 cursor-pointer hover:bg-pink-800"
                >
                  <div className="font-bold text-pink-400">{option.label}</div>
                  <div className="text-sm text-gray-400">
                    {option.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="mt-4 text-sm text-gray-300">
            <strong>Keterangan:</strong> {selected.description}
          </div>
        )}
      </div>
      {questionsLast === true && selected && (
        <div className="relative justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="absolute right-6 lg:top-11 border border-pink-800 rounded px-3 py-2 text-white hover:bg-pink-800 transition disabled:opacity-50 flex items-center justify-center"
            style={{ width: "130px", height: "44px" }}
          >
            {loading ? (
              <div className="mt-4 ml-5 flex items-center justify-center">
                <FadeLoader
                  color="#ec4899"
                  height={7}
                  width={2}
                  margin={-7}
                  loading={true}
                />
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default OptionQuestion;
