import React, { useEffect, useRef, useState } from "react";
import { CiSearch, CiClock2 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import { IoReload, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const SearchInputMobile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    setSearchHistory(history ? JSON.parse(history) : []);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    const handler = setTimeout(async () => {
      try {
        const { data } = await api.get(
          `/api/damanorganic/product_search?searchValue=${searchTerm}`
        );
        if (data.code === 200) {
          setSearchResults(data.data.results);
        } else {
          throw new Error("Something went wrong");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch results");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const saveToHistory = (item) => {
    const updated = [
      item,
      ...searchHistory.filter((i) => i?._id !== item._id),
    ].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setSearchHistory(updated);
  };

  const onResultClick = (item) => {
    navigate(`/product/${item.prd_Name}/${item._id}`);
    setIsFocus(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current.focus();
  };

  const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };

  const displayList = searchTerm ? searchResults : searchHistory;

  return (
    <div className="relative w-full">
      {/* Input bar */}
      <div className="relative flex items-center w-full py-2 px-2 rounded-lg border border-gray-300">
        <FiSearch size={20} className="text-gray-500 mr-2" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onFocus={() => setIsFocus(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-base placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {isFocus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
          >
            {/* Sticky search bar inside overlay */}
            <div className="flex items-center p-3 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-lg px-2"
                autoFocus
              />
              <button
                onClick={() => setIsFocus(false)}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex justify-center items-center py-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="text-primary"
                  >
                    <IoReload size={22} />
                  </motion.div>
                  <span className="ml-2 text-gray-600">Searching...</span>
                </div>
              )}

              {error && (
                <div className="p-4 text-center text-red-500 bg-red-50">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className="divide-y divide-gray-100">
                  {displayList.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      {searchTerm ? "No results found" : "No recent searches"}
                    </div>
                  ) : (
                    <>
                      {!searchTerm && (
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                          <div className="flex items-center text-sm text-gray-500">
                            <CiClock2 className="mr-2" />
                            Recent searches
                          </div>
                          <button
                            onClick={clearHistory}
                            className="text-xs text-primary hover:text-primaryDark"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                      {displayList.map((item, idx) => {
                        const isHistory = !searchTerm;
                        const label = isHistory
                          ? item?.prd_Name
                          : item.prd_Name;
                        return (
                          <div
                            key={isHistory ? `${label}-${idx}` : item._id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSearchTerm(label);
                              onResultClick(item);
                              saveToHistory(item);
                            }}
                          >
                            {isHistory ? (
                              <CiClock2 size={20} className="text-gray-400" />
                            ) : (
                              <img
                                src={item.image}
                                alt={label}
                                className="w-10 h-10 object-cover rounded-md"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {label}
                              </p>
                              {!isHistory && (
                                <p className="text-xs text-gray-500 truncate">
                                  {item.prd_Name}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInputMobile;
