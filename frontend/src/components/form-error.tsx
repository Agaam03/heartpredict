import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <>
      {message && message.length > 0 && (
        <div className=" text-red-500 flex items-center gap-2 py-1border border-red-300 text-sm animation-fade-in">
          <FaTriangleExclamation />
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default FormError;
