
const PageNotFound = () => {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-700">404</h1>
          <p className="mt-4 text-xl text-gray-500">
            Oops! The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  };

  export default PageNotFound;