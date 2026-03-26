import api from "../utils/api";


  // Function to upload image
  export const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await api.post(
        `/api/damanorganic/uploads3`,
        formData
      );

      if (response.data.code===201) {
        return response.data.data.results; // Return uploaded image URL
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Image upload failed");
    }
  };