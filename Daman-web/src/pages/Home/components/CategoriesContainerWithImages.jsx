import RouterLink from "../../../components/global/RouterLink";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import CategoryItemWithImage from "./CategoryItemWithImage";
import CategoryItemShimmer from "./CategoryItemShimmer";
import { useSelector } from "react-redux";

const CategoriesContainerWithImages = () => {
  const { categories, loading, error } = useSelector(
    (state) => state.categories,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1 flex items-center justify-start">
          <h3 className="uppercase font-bold md:text-xl">Our Categories</h3>
          <div className="h-[2px] flex-[0.9] bg-gradient-to-r from-[lightgray] via-[lightgray] to-transparent mx-auto" />
        </div>
        {!loading && !error && categories?.length > 0 && (
          <RouterLink
            to={`/category?id=${categories?.[0]?._id}&categoryName=${categories?.[0]?.CategoryName}`}
            scrollBehavior="smooth"
            className="flex items-center font-semibold"
          >
            <p>See All</p> <MdOutlineKeyboardArrowRight size={20} />
          </RouterLink>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="text-red-500 font-semibold text-center my-4">
          Failed to load categories. Please try again later.
        </div>
      )}

      {/* Mobile Grid (no scroll, 3/3 layout) */}
      <div className="grid grid-cols-3 gap-4 md:hidden">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <CategoryItemShimmer key={i} />
          ))}
        {!loading &&
          !error &&
          categories?.map((category, i) => (
            <CategoryItemWithImage key={i} category={category} />
          ))}
      </div>

      {/* Desktop Horizontal Scroll with Arrows */}
      <div className="relative hidden md:block">
        {/* {!loading && categories?.length > 0 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          >
            <RiArrowLeftSLine size={20} />
          </button>
        )} */}

        {/* overflow-x-auto no-scrollbar scroll-smooth */}
        <div className="flex flex-wrap gap-5 md:gap-[3.2rem]">
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <CategoryItemShimmer key={i} />
            ))}
          {!loading &&
            !error &&
            categories?.map((category, i) => (
              <CategoryItemWithImage key={i} category={category} />
            ))}
        </div>

        {/* {!loading && categories?.length > 0 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          >
            <RiArrowRightSLine size={20} />
          </button>
        )} */}
      </div>
    </div>
  );
};

export default CategoriesContainerWithImages;
