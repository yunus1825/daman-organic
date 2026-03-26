import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import Marquee from "react-fast-marquee";
const ReviewsComponent = ({ reviews }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="mx-auto pt-6">
      <Marquee pauseOnHover={true} gradient={false} speed={50} className="p-3">
        {reviews.map((review) => {
          const [expanded, setExpanded] = useState(false);
          const maxChars = 150;
          const isLong = review?.review?.length > maxChars;

          const displayText = expanded
            ? review.review
            : review.review.slice(0, maxChars) + (isLong ? "..." : "");

          return (
            <motion.div
              key={review._id}
              variants={itemVariants}
              className="bg-white rounded-xl mr-4 shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow duration-300 min-w-[300px] max-w-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaUserCircle className="h-12 w-12 text-primary" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{displayText}</p>
                  {isLong && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-sm text-blue-500 hover:underline mt-1"
                    >
                      {expanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </Marquee>
    </div>
  );
};

export default ReviewsComponent;
