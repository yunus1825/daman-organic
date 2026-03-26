import { MdErrorOutline, MdRefresh } from 'react-icons/md';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center max-w-md">
      <div className="flex flex-col items-center space-y-3">
        <MdErrorOutline className="text-5xl text-red-500" />
        <p className="text-lg font-medium">{message || 'Something went wrong!'}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          <MdRefresh className="text-xl" /> Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
