import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center">
            <svg
              className="h-48 w-48 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mt-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">Oops! Page not found</h2>
          <p className="text-gray-500 mt-2">
            We can't seem to find the page you're looking for.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }