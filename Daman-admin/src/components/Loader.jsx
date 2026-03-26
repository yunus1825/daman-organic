const Loader = () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-3 text-lg text-blue-500">Loading...</p>
      </div>
    );
  };
  
  export default Loader;
  