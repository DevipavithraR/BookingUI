import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircle, Error, Close } from "@mui/icons-material";

// Custom toast content component
const ToastContent = ({ type, message, darkMode, closeToast }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="text-green-500 text-2xl shrink-0 mt-1" />
        );
      case "error":
        return <Error className="text-red-500 text-2xl shrink-0 mt-1" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          border: "border-green-500",
          bg: darkMode ? "bg-green-800" : "bg-green-50",
          text: darkMode ? "text-green-100" : "text-green-900",
        };
      case "error":
        return {
          border: "border-red-500",
          bg: darkMode ? "bg-red-800" : "bg-red-50",
          text: darkMode ? "text-red-100" : "text-red-900",
        };
      default:
        return {
          border: "border-gray-500",
          bg: darkMode ? "bg-gray-800" : "bg-gray-50",
          text: darkMode ? "text-white" : "text-gray-800",
        };
    }
  };

  const { border, bg, text } = getColors();

  return (
    <div
      className={`
        flex items-center p-4 pr-3 rounded-md shadow-lg border-l-4
        ${bg} ${text} ${border} min-w-[300px] max-w-md
      `}
    >
      <div className="mr-3">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
    </div>
  );
};

// Toast hook for easy usage
export const useToast = (darkMode = false) => {
  const showToast = (type, message, options = {}) => {
    const toastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: false,
      ...options,
    };

    const content = ({ closeToast }) => (
      <ToastContent
        type={type}
        message={message}
        darkMode={darkMode}
        closeToast={closeToast}
      />
    );

    switch (type) {
      case "success":
        toast.success(content, toastOptions);
        break;
      case "error":
        toast.error(content, toastOptions);
        break;
      default:
        toast(content, toastOptions);
    }
  };

  return {
    success: (message, options) => showToast("success", message, options),
    error: (message, options) => showToast("error", message, options),
  };
};

// Toast container component
export const CustomToastContainer = ({ darkMode = false }) => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={darkMode ? "dark" : "light"}
      toastClassName={() => `
        ${darkMode ? "bg-gray-800" : "bg-white"} 
        rounded-md shadow-lg mb-3 overflow-hidden
      `}
      bodyClassName={() => "p-0"}
      className="mt-12"
      closeButton={true}
    />
  );
};
