import { useState } from "react";
import { FiEdit, FiX, FiSave, FiUser, FiPhone, FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import api from "../utils/api";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/slices/authSlice";

// Make sure to bind modal to your app root element
if (typeof document !== "undefined") {
  Modal.setAppElement("#root"); // or '#__next' for Next.js
}

const UserCard = () => {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      dispatch(updateUserStart());
      const response = await api.put(
        `/api/damanorganic/update_user/${user?._id}`,
        formData
      );
      console.log("Update successful:", response.data);
      if (response.data.code === 200) {
        dispatch(updateUserSuccess(response.data.data.results));
        setIsModalOpen(false);
      }
      // Optionally dispatch an action to update user in Redux store
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user details");
      console.error("Update error:", err);
      dispatch(updateUserFailure(error.message));
    } finally {
      setIsLoading(false);
    }
  };
  //   Alternative approach (if you prefer a single reducer):
  // If you don't need separate start/success/failure actions, you could simplify it with a single reducer:

  // javascript
  // updateUser: (state, action) => {
  //   if (state.user) {
  //     state.user = {
  //       ...state.user,
  //       ...action.payload
  //     };
  //   }
  // }

  // Modal styles
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "none",
      borderRadius: "12px",
      padding: "0",
      width: "100%",
      maxWidth: "450px",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
    },
  };

  // Animation for the modal content
  const afterOpenModal = () => {
    // You can add any animation logic here if needed
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-start p-6 border-b-2 pb-10 border-gray-200 rounded-lg shadow-sm bg-white gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary flex justify-center items-center">
            <p className="text-white font-medium">{user?.name?.slice(0, 1)}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <FiPhone size={14} /> {user?.phone}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <FiMail size={14} /> {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary cursor-pointer text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 hover:shadow-md transition-all"
        >
          <p className="text-sm">Edit</p>
          <FiEdit size={14} />
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        contentLabel="Edit User Modal"
        closeTimeoutMS={200}
      >
        <div className="w-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Edit Profile
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Full Name"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  disabled
                  onChange={handleInputChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-primary rounded-lg hover:shadow-md flex items-center gap-2 disabled:opacity-70 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <FiSave size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default UserCard;
