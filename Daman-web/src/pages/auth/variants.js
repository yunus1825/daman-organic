export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export const otpInputVariants = {
  focus: { scale: 1.05, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" },
  hover: { scale: 1.02 },
};
