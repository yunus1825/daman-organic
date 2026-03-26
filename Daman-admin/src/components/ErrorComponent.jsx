const ErrorComponent = ({ message }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 text-xl font-semibold">Error Occurred</p>
        <p className="text-gray-500 text-2xl">{message}</p>
      </div>
    );
  };
  
  export default ErrorComponent;
  