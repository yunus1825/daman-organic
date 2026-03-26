import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Table, Popconfirm } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import { deletePincode, fetchPincodes } from "../../redux/slices/pincodesSlice";
import Loader from "../../components/Loader";
const PincodesList = () => {
  const dispatch = useDispatch();
  const { pincodes, loading, error } = useSelector((store) => store.pincodes);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPincodes());
  }, [dispatch]);

  // Handle delete action
  const handleDelete = (record) => {
    dispatch(deletePincode(record._id));

  };

  const columns = [
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/EditPincode/${record?._id}`}>
            <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this Pincode?"
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
          onClick={() => navigate("/AddPincode")}
          label={"Add Pincode"}
          variant="add"
        ></CustomButton>
      </div>
      <Table columns={columns} dataSource={pincodes} rowKey="id" />
    </div>
  );
};

export default PincodesList;
