import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Image, Popconfirm } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import Loader from "../../components/Loader";
import {
  deleteStore,
  fetchStores,
} from "../../redux/slices/storeManagementSlice";

const StoreList = () => {
  const dispatch = useDispatch();
  const { stores, loading, error } = useSelector((store) => store.stores);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  // Handle delete action
  const handleDelete = (record) => {
    dispatch(deleteStore(record._id));

    // Dispatch delete action if needed
  };

  const columns = [
    {
      title: "Store Name",
      dataIndex: "store_name",
      key: "store_name",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Store Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/EditStore/${record?._id}`}>
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
      <div className="flex justify-end">
        <CustomButton
          onClick={() => navigate("/AddStore")}
          label={"Add Store"}
          variant="add"
        ></CustomButton>
      </div>
      <Table columns={columns} dataSource={stores} rowKey="_id" />
    </div>
  );
};

export default StoreList;
