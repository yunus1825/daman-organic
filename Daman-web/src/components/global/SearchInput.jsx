import React, { useEffect, useRef, useState } from "react";
import { CiSearch, CiClock2 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { IoReload, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Detect outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    return () => {
      clearTimeout(handler);
      setLoading(false);
    };
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
    <div className="relative w-full z-50 max-w-2xl" ref={containerRef}>
      <div className="relative flex justify-between items-center w-full py-2 px-4  rounded-full border-2 border-primary">
        <input
          ref={inputRef}
          type="text"
          placeholder={`Search for "Apple"`}
          value={searchTerm}
          onFocus={() => setIsFocus(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-0 pl-2"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="   text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        )}
        <div className="p-1 rounded-[3px] bg-primaryDark">
          <FiSearch size={16} className=" text-white " />
        </div>
      </div>

      <AnimatePresence>
        {isFocus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:absolute max-h-[50vh]  overflow-y-scroll  mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100"
          >
            {loading && (
              <div className="flex justify-center items-center p-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="text-primary"
                >
                  <IoReload size={20} />
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
                  <div className="p-4 text-center text-gray-400">
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
                          className="text-xs text-primary hover:text-primaryDark cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                    {displayList.map((item, idx) => {
                      const isHistory = !searchTerm;
                      const label = isHistory ? item?.prd_Name : item.prd_Name;
                      return (
                        <motion.div
                          key={isHistory ? `${label}-${idx}` : item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSearchTerm(label);
                            onResultClick(item);
                            saveToHistory(item);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {isHistory ? (
                              <div className="text-gray-400">
                                <CiClock2 size={18} />
                              </div>
                            ) : (
                              <div className="flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={label}
                                  loading="lazy"
                                  className="w-8 h-8 object-cover rounded-md"
                                />
                              </div>
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
                            {isHistory && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchTerm(label);
                                  inputRef.current.focus();
                                }}
                                className="text-gray-400 hover:text-indigo-500"
                              >
                                <IoReload size={16} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
