import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Popconfirm } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import Loader from "../../components/Loader";
import { deleteAdmin, fetchAdmins } from "../../redux/slices/adminSlice";
const AdminList = () => {
  const dispatch = useDispatch();

  const { admins, loading, error } = useSelector((store) => store.admins);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  // Handle delete action
  const handleDelete = (record) => {
    dispatch(deleteAdmin(record._id));

    // Dispatch delete action if needed
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "Address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/editAdmin/${record?._id}`}>
            <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this Admin?"
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
          onClick={() => navigate("/addAdmin")}
          label={"Add Admin"}
          variant="add"
        ></CustomButton>
      </div>
      <Table columns={columns} dataSource={admins} rowKey="id" />
    </div>
  );
};

export default AdminList;
