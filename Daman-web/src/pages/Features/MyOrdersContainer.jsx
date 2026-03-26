import OrderItem from "./components/OrderItem";
import { useSelector } from "react-redux";
import { Spin, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import RouterLink from "../../components/global/RouterLink";

const MyOrdersContainer = () => {
  const { orders, loading, error } = useSelector((store) => store.orders);

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderedDate) - new Date(a.orderedDate)
  );

  // Loading indicator
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="border-2 px-4 md:px-8 pb-16 border-gray-300 rounded-xl bg-white">
        <h3 className="font-medium text-lg md:text-xl my-5">My Orders</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spin indicator={antIcon} />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading orders: {error}
          </div>
        ) : sortedOrders.length === 0 ? (
          <Empty
            description="You haven't placed any orders yet"
            className="py-8"
          >
            <RouterLink to="/" className="text-primary hover:underline">
              Browse Products
            </RouterLink>
          </Empty>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <OrderItem key={order._id} order={order} /> // Changed key to order._id
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersContainer;
