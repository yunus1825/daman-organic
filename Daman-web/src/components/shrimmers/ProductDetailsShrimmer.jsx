import { motion } from "framer-motion";

export const ProductDetailsShrimmer = () => {
  // Animation variants
  const shimmerVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: 0.8,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Thumbnails Shimmer */}
        <div className="lg:w-1/12 flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              variants={shimmerVariants}
              className="w-16 h-16 bg-gray-200 rounded-md"
            />
          ))}
        </div>

        {/* Center Column - Main Image Shimmer */}
        <div className="lg:w-6/12 order-1 border-2 shadow rounded-md p-5 border-gray-300 w-full h-fit lg:order-2">
          <motion.div
            variants={shimmerVariants}
            className="w-full h-[40vh] md:h-[60vh] bg-gray-200 rounded-lg"
          />
        </div>

        {/* Right Column - Product Details Shimmer */}
        <div className="lg:w-5/12 order-3 lg:order-3">
          <div className="space-y-4">
            <motion.div
              variants={shimmerVariants}
              className="h-8 w-3/4 bg-gray-200 rounded"
            />
            <motion.div
              variants={shimmerVariants}
              className="h-4 w-1/2 bg-gray-200 rounded"
            />
            <motion.div
              variants={shimmerVariants}
              className="h-4 w-1/3 bg-gray-200 rounded"
            />
            <motion.div
              variants={shimmerVariants}
              className="h-6 w-1/4 bg-gray-200 rounded"
            />
            <motion.div
              variants={shimmerVariants}
              className="h-4 w-1/5 bg-gray-200 rounded"
            />

            <div className="flex justify-center gap-4 items-center pt-4">
              <motion.div
                variants={shimmerVariants}
                className="w-full h-12 bg-gray-200 rounded-md"
              />
              <motion.div
                variants={shimmerVariants}
                className="w-full h-12 bg-gray-200 rounded-md"
              />
            </div>

            <div className="flex items-center gap-3 my-5">
              <motion.div
                variants={shimmerVariants}
                className="h-4 w-24 bg-gray-200 rounded"
              />
              <motion.div
                variants={shimmerVariants}
                className="h-5 w-5 bg-gray-200 rounded"
              />
            </div>

            {/* Accordion Shimmers */}
            <motion.div variants={shimmerVariants} className="border-b pb-4">
              <div className="h-5 w-1/3 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded mt-2" />
              <div className="h-3 w-4/5 bg-gray-200 rounded mt-2" />
            </motion.div>

            <motion.div variants={shimmerVariants} className="border-b pb-4">
              <div className="h-5 w-1/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-full bg-gray-200 rounded mt-2" />
              <div className="h-3 w-3/4 bg-gray-200 rounded mt-2" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
