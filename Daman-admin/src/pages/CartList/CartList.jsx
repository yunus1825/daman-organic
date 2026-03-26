import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Table } from "antd";
import ErrorComponent from "../../components/ErrorComponent";
import { useNavigate } from "react-router-dom";
import { fetchCartList } from "../../redux/slices/cartlistSlice";
import Loader from "../../components/Loader";
import { AiOutlineEye } from "react-icons/ai";
const CartList = () => {
  const dispatch = useDispatch();
  const { cartlist, loading, error } = useSelector((store) => store.cartlist);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCartList());
  }, [dispatch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Cart Count",
      dataIndex: "cartCount",
      key: "cartCount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <button
          onClick={() => navigate(`/cart-details/${record.userId}`)}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          <AiOutlineEye className="text-xl" />
        </button>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div>
      <div className="flex justify-start text-[0.7rem] md:text-xl font-bold">
        <h1>Abandoned Carts List</h1>
      </div>
      <Table columns={columns} dataSource={cartlist} rowKey="id" />
    </div>
  );
};

export default CartList;
