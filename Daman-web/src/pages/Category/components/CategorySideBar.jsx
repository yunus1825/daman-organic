import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProducts,
  fetchProductsByCategory,
} from "../../../redux/slices/productsByCategorySlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

const CategorySideBar = () => {
  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryName = searchParams.get("categoryName");
  const categoryId = searchParams.get("id");

  const [selectedCategory, setSelectedCategory] = useState(null);

  // store refs for each category
  const categoryRefs = useRef({});

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId, categoryName]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(clearProducts());
      dispatch(
        fetchProductsByCategory({ categoryId: selectedCategory, page: 1 })
      );

      // scroll into view
      const selectedEl = categoryRefs.current[selectedCategory];
      if (selectedEl) {
        selectedEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest", // keeps it in view without jumping to top
        });
      }
    }
  }, [selectedCategory, dispatch]);

  return (
    <motion.div
      className="flex flex-col gap-3 p-1 md:p-2 h-fit bg-white overflow-y-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {categories?.map((category, index) => {
        const isSelected = selectedCategory === category?._id;
        return (
          <motion.div
            key={index}
            ref={(el) => (categoryRefs.current[category._id] = el)} // store ref
            onClick={() => {
              searchParams.set("categoryName", category?.CategoryName);
              searchParams.set("id", category?._id);
              setSearchParams(searchParams);
              setSelectedCategory(category._id);
            }}
            className={`flex items-center max-md:flex-col gap-4 p-1 md:p-4 rounded-md cursor-pointer ${
              isSelected
                ? "bg-gradient-to-t from-primaryLight to-white"
                : "bg-white"
            }`}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            animate={isSelected ? "selected" : "unselected"}
          >
            <motion.div
              className="h-14 w-14  rounded-sm overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <LazyLoadImage
                alt="category"
                src={category?.Image}
                effect="blur"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.p
                key={isSelected ? "selected" : "not-selected"}
                className={`text-sm ${
                  isSelected ? "font-semibold text-primary" : "text-gray-700"
                } max-md:text-center max-sm:text-[12px]`}
                initial={{ x: -5, opacity: 0.8 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {category?.CategoryName}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className="ml-auto h-2 w-2 max-md:hidden bg-primary rounded-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring" }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CategorySideBar;
