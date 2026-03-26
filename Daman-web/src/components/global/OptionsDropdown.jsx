import React, { useEffect, useRef, useState, useCallback } from "react";
import { currencySymbol } from "../../constants/constants";

const OptionsDropdown = ({
  variants = [],
  onSelect,
  selectedVariant,
  buttonTextClass = "text-[0.6rem] md:text-base", // default styles
  optionTextClass = "text-[0.6rem] md:text-base", // default styles
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleOptionClick = (variant) => {
    onSelect(variant);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block w-full mb-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-2 max-md:font-bold md:px-4 py-2 border border-gray-400 rounded-md bg-white text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <p className={buttonTextClass}>
          {selectedVariant
            ? `${selectedVariant?.quantity} ${selectedVariant.Type} - ${currencySymbol}${selectedVariant.selling_Price}`
            : "Select Option"}
        </p>
      </button>

      {open && (
        <ul
          className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
          role="listbox"
        >
          {selectedVariant !== null && (
            <li
              role="option"
              onClick={() => handleOptionClick(null)}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition ${
                selectedVariant === null ? "bg-blue-200" : ""
              }`}
            >
              <div className="flex justify-center">
                <span className={optionTextClass}>Deselect</span>
              </div>
            </li>
          )}
          {variants.map((variant) => (
            <li
              key={variant._id}
              role="option"
              aria-selected={selectedVariant?._id === variant._id}
              onClick={() => handleOptionClick(variant)}
              className={`px-2 md:px-4 py-2 hover:bg-gray-100 cursor-pointer transition ${
                selectedVariant?._id === variant._id ? "bg-blue-200" : ""
              }`}
            >
              <div className="flex justify-between">
                <span
                  className={optionTextClass}
                >{`${variant.quantity} ${variant.Type}`}</span>
                <span className={optionTextClass}>
                  {currencySymbol}
                  {variant.selling_Price}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OptionsDropdown;
