import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Popconfirm, Table } from "antd";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import {
  deleteDeliveryCharge,
  fetchDeliveryCharges,
} from "../../redux/slices/deliveryChargesSlice";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import CustomButton from "../globalComponents/CustomButton";

const DeliveryChargesList = () => {
  const dispatch = useDispatch();

  const { deliveryCharges, loading, error } = useSelector(
    (store) => store.deliveryCharges
  );

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDeliveryCharges());
  }, [dispatch]);

  const handleDelete = (record) => {
    dispatch(deleteDeliveryCharge(record?._id));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "tittle",
      key: "tittle",
    },
    {
      title: "Kms",
      dataIndex: "kms",
      key: "kms",
    },
    {
      title: "Charges",
      dataIndex: "charges",
      key: "charges",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/EditDeliveryCharge/${record?._id}`}>
            <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this brand?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <span>
              <AiOutlineDelete
                className="text-red-500 cursor-pointer"
                size={20}
              />
            </span>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="form-title">Delivery Charges</h1>
        <CustomButton
          onClick={() => navigate("/AddDeliveryCharge")}
          label={"Add Delivery Charge"}
          variant="add"
        ></CustomButton>
      </div>
      <Table columns={columns} dataSource={deliveryCharges} rowKey="id" />
    </div>
  );
};

export default DeliveryChargesList;
