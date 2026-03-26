// components/CheckoutNav.jsx
import { motion } from "framer-motion";

const steps = ["Cart", "Address & Payment", "Confirm"];

export default function CheckoutNav({ currentStep, setCurrentStep }) {
  return (
    <div className="flex justify-between px-6 py-4 bg-gray-200">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center flex-1">
          <div className="flex items-center w-full">
            {index > 0 && (
              <div
                className={`flex-1 h-0.5  ${
                  currentStep > index ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
            <motion.div
              onClick={() => {
                if (currentStep > index + 1) {
                  setCurrentStep(index + 1);
                }
              }}
              className={`w-10 cursor-pointer h-10 rounded-full flex items-center justify-center text-sm font-medium 
                ${
                  currentStep > index + 1
                    ? "bg-green-500 text-white"
                    : currentStep === index + 1
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep > index + 1 ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  currentStep > index + 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
          <p
            className={`text-xs  mt-2 ${index === 0 && "self-start"} ${
              index === 2 && "self-end"
            } ${
              currentStep >= index + 1
                ? "text-gray-800 font-medium"
                : "text-gray-500"
            }`}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}
