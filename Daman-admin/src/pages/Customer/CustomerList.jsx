import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Table } from "antd";
import ErrorComponent from "../../components/ErrorComponent";
import { useNavigate } from "react-router-dom";
import {  fetchCustomerList } from "../../redux/slices/customerSlice";
import Loader from "../../components/Loader";
import moment from "moment";
const CustomerList = () => {
  const dispatch = useDispatch();
  const { customerlist, loading, error } = useSelector((store) => store.customerlist);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCustomerList());
  }, [dispatch]);

 

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "User ID",
      dataIndex: "customId",
      key: "customId",
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
      title: "Login",
      dataIndex: "signUpdate",
      key: "signUpdate",
      render: (date) => moment(date).format("DD MMM YYYY, h:mm A"), // Formatting
    },
    
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div>
      <div className="flex justify-start text-[0.7rem] md:text-xl font-bold">
        <h1>customers List</h1>
      </div>
      <Table columns={columns} dataSource={customerlist} rowKey="id" />
    </div>
  );
};

export default CustomerList;
