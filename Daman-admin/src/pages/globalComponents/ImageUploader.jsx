import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";

const ImageUploader = ({ onImageSelect, imageUrl }) => {
  const [image, setImage] = useState(imageUrl || null);

  useEffect(() => {
    // Update the image state if a new imageUrl is passed
    setImage(imageUrl);
  }, [imageUrl]);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageSelect(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImageChange(file);
  };

  const removeImage = () => {
    setImage(null);
    onImageSelect(null);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full max-w-sm p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {!image ? (
        <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer">
          <FiUpload className="text-gray-500 text-4xl mb-2" />
          <span className="text-sm text-gray-600">Drag & Drop or Click to Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative w-full">
          <img src={image} alt="Preview" className="w-full h-40 object-contain rounded-lg" />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
            onClick={removeImage}
          >
            <FiX className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
