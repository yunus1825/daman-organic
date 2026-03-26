import React from 'react';

const BtnSpinner = ({ loading, children, ...props }) => {
  return (
    <button
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 ${
        loading ? 'cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default BtnSpinner;
