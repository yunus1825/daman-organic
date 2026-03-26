import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMarquees,
  addMarquee,
  deleteMarquee,
  toggleActive,
  updateMarquee,
} from "../../redux/slices/marqueeSlice";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";
import Marquee from "react-fast-marquee";

const MarqueeManager = () => {
  const dispatch = useDispatch();
  const {
    items: marquees,
    loading,
    error,
  } = useSelector((state) => state.marquee);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    dispatch(fetchMarquees());
  }, [dispatch]);

  const handleAdd = () => {
    if (!newText) return;
    dispatch(addMarquee(newText));
    setNewText("");
  };
  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-800">
        Marquee Manager
      </h1>

      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter marquee text"
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>
      <div className="bg-primary text-white py-2 mb-3">
        <Marquee pauseOnHover={true} gradient={false} speed={50}>
          <div className="flex items-center space-x-4">
            {Array(1)
              .fill(
                marquees
                  .filter((m) => m.isActive)
                  .map((m) => m.text)
                  .join(" | ")
              )
              .map((text, idx) => (
                <div key={idx} className="px-4">
                  {text}
                </div>
              ))}
          </div>
        </Marquee>
      </div>

      <ul className="space-y-3">
        {marquees.map((marquee) => (
          <li
            key={marquee._id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            {editingId === marquee._id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="border p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <span
                className={`text-gray-800 font-medium ${
                  marquee.isActive ? "" : "line-through text-gray-400"
                }`}
              >
                {marquee.text}
              </span>
            )}

            <div className="flex gap-2 ml-2">
              {editingId === marquee._id ? (
                <>
                  <button
                    onClick={() => {
                      if (editingText.trim()) {
                        dispatch(
                          updateMarquee({
                            id: marquee._id,
                            text: editingText,
                            isActive: marquee.isActive,
                          })
                        );
                        setEditingId(null);
                      }
                    }}
                    className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded-lg font-medium hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-800 cursor-pointer px-3 py-1 rounded-lg font-medium hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(marquee._id);
                      setEditingText(marquee.text);
                    }}
                    className="bg-blue-500 text-white cursor-pointer px-3 py-1 rounded-lg font-medium hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(toggleActive(marquee))}
                    className={`px-3 py-1 cursor-pointer rounded-lg font-medium transition ${
                      marquee.isActive
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {marquee.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => dispatch(deleteMarquee(marquee._id))}
                    className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-lg font-medium hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarqueeManager;
