import Marquee from "react-fast-marquee";
import { useSelector } from "react-redux";

const Ribbon = () => {
  const {
    items: marquees,
    loading,
    error,
  } = useSelector((state) => state.marquee);

  return (
    <div className="bg-primary py-2">
      <Marquee pauseOnHover={true} gradient={false} speed={50}>
        <div className="flex gap-[200px] md:gap-[400px]">
          <div className="flex items-center gap-4 px-4 ">
            <p className="text-white text-sm sm:text-base text-center">
              {(() => {
                const activeTexts = marquees
                  .filter((m) => m.isActive)
                  .map((m) => m.text)
                  .join(" | ");

                return activeTexts ? (
                  <div className="px-4">{activeTexts}</div>
                ) : (
                  <div className="px-4">{""} </div>
                );
              })()}
            </p>
          </div>
          <div className="flex items-center gap-4 px-4">
            <p className="text-white text-sm sm:text-base text-center">
              {(() => {
                const activeTexts = marquees
                  .filter((m) => m.isActive)
                  .map((m) => m.text)
                  .join(" | ");

                return activeTexts ? (
                  <div className="px-4">{activeTexts}</div>
                ) : (
                  <div className="px-4">
                    Welcome to Daman Organic – Freshness Delivered Naturally 🌱
                  </div>
                );
              })()}
            </p>
          </div>
        </div>
      </Marquee>
    </div>
  );
};

export default Ribbon;
