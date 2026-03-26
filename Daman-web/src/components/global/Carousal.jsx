import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Carousal = () => {
  const { sliders = [], loading } = useSelector((state) => state.sliders);

  if (loading) {
    return (
      <div className="h-40 md:h-[500px] rounded-2xl bg-gray-200 animate-pulse" />
    );
  }

  if (!sliders || sliders.length === 0) {
    return (
      <div className="h-40 md:h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center">
        <p>No slides available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto rounded-2xl">
      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          el: ".custom-pagination", // 👈 send bullets here
          clickable: true,
        }}
        loop={true}
        className="h-40 md:h-[500px] rounded-2xl"
      >
        {sliders.map((slide) => (
          <SwiperSlide key={slide._id}>
            <img
              src={slide.Image}
              alt={slide.Tittle}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Container */}
      <div className="custom-pagination flex justify-center mt-3 space-x-2"></div>
    </div>
  );
};

export default Carousal;
