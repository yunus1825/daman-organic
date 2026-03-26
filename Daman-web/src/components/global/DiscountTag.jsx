import React, { memo } from "react";

const DiscountTag = memo(({ discount = 0 }) => {
  if (discount >= 0) {
    return null;
  }
  return (
    <div
      className="bg-primary relative rounded-full h-[30px] w-[30px] md:h-[50px] overflow-hidden md:w-[50px] flex flex-col justify-center items-center"
      aria-label={`${discount}% OFF tag`}
    >
      <p className="text-white text-[8px] md:text-[10px] font-bold">{`${discount}%`}</p>
      <p className="text-white text-[8px] md:text-[10px] font-bold">OFF</p>
      <div className="bg-gray-200 rounded-full h-[50px] absolute top-[50%] left-[73%] w-[50px]"></div>
    </div>
  );
});

export default DiscountTag;
