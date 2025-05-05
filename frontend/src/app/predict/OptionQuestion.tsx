"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
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

  const handleSelect = (option: (typeof options)[0]) => {
    setSelected(option);
    setIsOpen(false);
    if (!questionsLast) {
      onAnswer(option.value); // langsung kirim kalau BUKAN pertanyaan terakhir
    }
    console.log(option);
  };

  return (
    <>
      <div className="text-white flex flex-col w-full px-10 py-8 rounded-xl ">
        <div className="relative w-full max-w-xl">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full border border-pink-800 px-4 py-2 rounded bg-transparent text-left flex justify-between items-center hover:bg-pink-900 transition"
          >
            {selected ? selected.label : "Select on option"}
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
        <div className="relative justify-end ">
          <button
            onClick={() => {
              if (selected) {
                onAnswer(selected.value);
              }
            }}
            className="absolute right-6 lg:top-11 mt-4 border border-pink-800 rounded px-4 py-2 text-white hover:bg-pink-800 transition"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
};

export default OptionQuestion;
