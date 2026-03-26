import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Table } from "antd";
import ErrorComponent from "../../components/ErrorComponent";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchOrders } from "../../redux/slices/ordersSlice";
import { AiOutlineEye } from "react-icons/ai";
const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((store) => store.orders);
  const [activeTab, setActiveTab] = useState("Open");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders
    .filter(
      (order) => order.ordStatus.toLowerCase() === activeTab.toLowerCase()
    )
    .filter((order) =>
      order.ordId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const columns = [
    {
      title: "ORD ID",
      dataIndex: "ordId",
      key: "ordId",
    },
    {
      title: "ORD Status",
      dataIndex: "ordStatus",
      key: "ordStatus",
    },
    {
      title: "Total Price",
      dataIndex: "SubTotal",
      key: "SubTotal",
    },
    {
      title: "Payment Type",
      dataIndex: "PaymentType",
      key: "PaymentType",
    },
    {
      title: "Total Products",
      dataIndex: "TotalProductsCount",
      key: "TotalProductsCount",
    },
    {
      title: "Order Date",
      dataIndex: "OrderDate",
      key: "OrderDate",
    },
    {
      title: "Schedule Date",
      dataIndex: "scheduleDate",
      key: "scheduleDate",
    },
    {
      title: "Schedule Time",
      dataIndex: "scheduleTime",
      key: "scheduleTime",
    },
    {
      title: "User Name",
      dataIndex: "UserName",
      key: "UserName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex  justify-center items-center">
          <Link
            to={`/order-details/${record?._id}`}
            className="flex flex-1 justify-center items-center text-blue-600 hover:underline"
          >
            <AiOutlineEye className="text-xl" />
          </Link>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-[0.7rem] md:text-xl font-bold">
          <h1>All Orders</h1>
        </div>
        <Input
          placeholder="Search by Order ID"
          style={{ width: 200 }}
          value={searchTerm}
          onChange={handleSearch}
          allowClear
        />
      </div>
      <div className="flex space-x-4 mb-4">
        {["Open", "Accepted", "Assigned", "Delivered", "Cancelled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 cursor-pointer py-2 rounded ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <Table columns={columns} dataSource={filteredOrders} rowKey="_id" />
    </div>
  );
};

export default AllOrders;
