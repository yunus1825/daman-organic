import { FaShoppingCart } from "react-icons/fa";
import RouterLink from "./RouterLink";

const EmptyCartMessage = () => {
  return (
    <div className="text-center p-8 bg-white rounded-lg ">
      <div className="flex flex-col items-center space-y-4">
        <FaShoppingCart className="text-5xl text-gray-400" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-gray-600">
          Looks like you haven't added any items to your cart yet.
        </p>

        <RouterLink
          to={"/"}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          Continue Shopping
        </RouterLink>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
