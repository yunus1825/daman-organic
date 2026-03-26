import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import RouterLink from "./global/RouterLink";
import { useDispatch } from "react-redux";
import { fetchProductsByCategory } from "../redux/slices/productsByCategorySlice";

const Breadcrumb = () => {
  const location = useLocation();
  const { productName, tab, orderId, categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("categoryName");
  const pathname = location.pathname;
  const dispatch = useDispatch();
  return (
    <nav id="site-bread-crumb" className="text-sm breadcrumbs my-2">
      <ul className="flex space-x-2 items-center  font-medium">
        <li className="flex items-center justify-center">
          <RouterLink to="/" className=" hover:underline">
            <HiOutlineHome className="inline-block" size={20} /> Home
          </RouterLink>
        </li>

        {categoryName && (
          <li>
            <span className="mx-1">
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
            </span>
            <RouterLink>{categoryName}</RouterLink>
          </li>
        )}

        {productName && (
          <li>
            <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
            <span className="capitalize text-gray-700">{productName}</span>
          </li>
        )}
        {pathname === "/cart" && (
          <li>
            <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
            <span className="capitalize text-gray-700">Cart</span>
          </li>
        )}
        {pathname === "/wishlist" && (
          <li>
            <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
            <span className="capitalize text-gray-700">Wishlist</span>
          </li>
        )}
        {pathname === "/checkout" && (
          <>
            <RouterLink to={"/profile/cart"} className=" hover:underline">
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
              <span className="capitalize text-gray-700">Cart</span>
            </RouterLink>
            <li>
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
              <span className="capitalize text-gray-700">Checkout</span>
            </li>
          </>
        )}
        {tab && (
          <>
            <li>
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
              <span className="capitalize text-gray-700">Profile</span>
            </li>
            <li>
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
              <span className="capitalize text-gray-700">{tab}</span>
            </li>
          </>
        )}
        {orderId && (
          <>
            <RouterLink to={"/profile/orders"}>
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
              <span className="capitalize text-gray-700">My Orders</span>
            </RouterLink>
            <li>
              <MdOutlineKeyboardArrowRight className="inline-block" size={20} />
              <span className="capitalize text-gray-700">{orderId}</span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
