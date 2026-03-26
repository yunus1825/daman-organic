import { motion } from "framer-motion";
import RouterLink from "../../../components/global/RouterLink";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FiChevronUp } from "react-icons/fi"; // optional icons

const CategoriesContainer = () => {
  const { categories, loading } = useSelector((state) => state.categories);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const targetScrollLeft = useRef(0);
  const ease = 0.1; // Smoothing factor (0 to 1)
  const [headerHeight, setHeaderHeight] = useState(0);

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);
  // Handle smooth horizontal scroll on mouse wheel
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();

      // Stop any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Update target scroll position
      targetScrollLeft.current += e.deltaY;

      // Clamp the target scroll position to valid range
      targetScrollLeft.current = Math.max(
        0,
        Math.min(
          targetScrollLeft.current,
          container.scrollWidth - container.clientWidth
        )
      );

      // Start smooth scrolling animation
      const animate = () => {
        const currentScrollLeft = container.scrollLeft;
        const diff = targetScrollLeft.current - currentScrollLeft;

        if (Math.abs(diff) > 0.5) {
          container.scrollLeft = currentScrollLeft + diff * ease;
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Animation variants for drop-down effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      color: "#3b82f6", // blue-500
      transition: { duration: 0.2 },
    },
  };
  const ShimmerItem = () => (
    <div className="animate-pulse bg-gray-100 h-10 w-32 rounded-lg" />
  );
  console.log(headerHeight, "headerHeight");
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="z-40 bg-white shadow-sm"
      style={{ top: `${headerHeight}px` }}
    >
      {/* --- Large screen layout --- */}
      <div
        className="hidden md:flex flex-row p-4 sticky items-center overflow-x-auto no-scrollbar"
        ref={containerRef}
      >
        <RouterLink
          className="shrink-0"
          to={`/category/${categories?.[0]?.CategoryName}/${categories?.[0]?._id}`}
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="bg-primary flex items-center gap-3 text-white p-2 rounded-[5px]"
          >
            Browse by Category
          </motion.p>
        </RouterLink>

        <div className="flex gap-4 ml-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <ShimmerItem key={i} />)
            : categories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover="hover"
                  className="shrink-0"
                >
                  <RouterLink
                    scrollBehavior="smooth"
                    className="shrink-0"
                    to={`/category/${category.CategoryName}/${category._id}`}
                  >
                    <motion.p className="cursor-pointer px-3 py-2 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                      {category.CategoryName}
                    </motion.p>
                  </RouterLink>
                </motion.div>
              ))}
        </div>
      </div>

      {/* --- Small screen layout --- */}
      <div className="block md:hidden px-4 py-3 space-y-3">
        <div className="flex flex-wrap gap-3 transition-all duration-300 ease-in-out">
          {(showAll ? categories : categories.slice(0, 6)).map(
            (category, index) => (
              <RouterLink
                key={index}
                to={`/category/${category.CategoryName}/${category._id}`}
                className="flex-1 min-w-[45%] text-center px-3 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                {category.CategoryName}
              </RouterLink>
            )
          )}
        </div>

        {/* Show More / Show Less Button */}
        {categories.length > 6 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="mt-4 w-full flex items-center justify-center gap-2 text-blue-600 font-medium hover:underline"
          >
            {showAll ? "Show Less" : "Show More"}
            {showAll ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CategoriesContainer;
