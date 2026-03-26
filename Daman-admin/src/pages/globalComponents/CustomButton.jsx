import React from "react";

const CustomButton = ({
  label,
  variant = "default",
  onClick,
  loading = false,
  styles="my-5"
}) => {
  const baseStyles =
    "px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition-all duration-300 flex  items-center justify-center";
  const variants = {
    add: "bg-green-500 text-white hover:bg-green-600",
    cancel: "bg-red-500 text-white hover:bg-red-600",
    save: "bg-blue-500 text-white hover:bg-blue-600",
    update: "bg-yellow-500 text-black hover:bg-yellow-600",
    default: "bg-gray-200 text-black hover:bg-gray-300",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.default} cursor-pointer ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${styles}`}
      onClick={!loading ? onClick : null}
      disabled={loading}
    >
      {loading && (
        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
      )}
      {label}
    </button>
  );
};

export default CustomButton;
