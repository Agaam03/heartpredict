import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
interface FormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  return (
    <>
      {message && message.length > 0 && (
        <div className=" text-green-500 flex items-center gap-2 py-1border border-red-300 text-sm animation-fade-in">
          <FaRegCheckCircle />
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default FormSuccess;
