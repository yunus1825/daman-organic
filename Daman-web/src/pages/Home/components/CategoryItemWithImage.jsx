import RouterLink from "../../../components/global/RouterLink";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const CategoryItemWithImage = ({ category }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <RouterLink
        scrollBehavior="smooth"
        className="shrink-0 w-[100px] md:w-[200px]"
        to={`/category?id=${category._id}&categoryName=${category?.CategoryName}`}
      >
        {/* Image */}
        {/* <img
          src={category.Image}
          alt={category.CategoryName}
          loading="lazy"
          className="rounded-2xl overflow-hidden w-full h-[100px] md:h-[200px] object-cover"
        /> */}
        <LazyLoadImage
          src={category.Image}
          alt={category.CategoryName}
          loading="lazy"
          effect="blur" // options: blur, opacity, black-and-white
          className="rounded-2xl overflow-hidden w-full h-[100px] md:h-[200px] object-cover"
        />

        {/* Label */}
        <div className=" flex items-center mt-3 w-full ">
          {/* <div className="w-1 h-5 bg-primary rounded-r-xl shrink-0"></div> */}
          {/* KEY: allow shrinking so truncation works */}
          <div className="flex-1 min-w-0 px-1">
            <p
              className="line-clamp-2 text-center max-md:text-[10px] text-sm font-bold md:font-medium"
              title={category.CategoryName}
            >
              {category.CategoryName}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  );
};

export default CategoryItemWithImage;
