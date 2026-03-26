import { motion } from "framer-motion";
import { currencySymbol } from "../../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import WhishlistItem from "./WhishlistItem";
import WhishlistMobileItem from "./WhishlistMobileItem";
import EmptyWishlistMessage from "../../../components/global/EmptyWishlistMessage";

const WhishlistContainer = () => {
  const { items, loading, error } = useSelector((state) => state.wishlist);

  if (loading)
    return <div className="text-center py-8">Loading wishlist...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <motion.div
      className="mx-auto "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {items.length === 0 ? (
        <div className="flex flex-col h-[80vh]  items-center justify-center">
          <EmptyWishlistMessage></EmptyWishlistMessage>
        </div>
      ) : (
        <motion.div
          className="border-2 border-primary rounded-xl overflow-hidden"
          variants={itemVariants}
        >
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-6 text-left text-xs font-semibold tracking-wider"
                    >
                      Products
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wider"
                    >
                      Price
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wider"
                    >
                      Delete
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wider"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items?.map((item) => (
                    <WhishlistItem item={item}></WhishlistItem>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden">
            {items?.map((item) => (
              <WhishlistMobileItem item={item} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WhishlistContainer;
