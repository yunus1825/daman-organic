import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Popconfirm, Image, Input, Switch, Tag } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import Loader from "../../components/Loader";
import {
  deleteProduct,
  fetchProducts,
  updateProductStock,
  updateProductVisibility,
} from "../../redux/slices/productSlice";
import BulkUploadModal from "./BulkUploadModal";

const { Search } = Input;

const ProductsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((store) => store.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, inStock, outStock, visible, hidden
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (record) => {
    dispatch(deleteProduct(record._id));
  };

  const handleStockToggle = (productId, currentStatus) => {
    const newStatus = !currentStatus;
    dispatch(updateProductStock({ id: productId, status: newStatus }));
  };

  const handleVisibilityToggle = (productId) => {
    dispatch(updateProductVisibility({ id: productId }));
  };

  const columns = [
    { title: "Name", dataIndex: "prd_Name", key: "prd_Name" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={50} height={50} />,
    },
    { title: "Category", dataIndex: "categoryName", key: "categoryName" },
    {
      title: "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
    },
    {
      title: "Display Price",
      dataIndex: "display_price",
      key: "display_price",
    },
    {
      title: "Stock Status",
      key: "stock",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={record.status}
            onChange={() => handleStockToggle(record._id, record.status)}
          />
          {record.status ? (
            <Tag color="green">In Stock</Tag>
          ) : (
            <Tag color="red">Out of Stock</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Visibility",
      key: "hide",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={!record.hide}
            onChange={() => handleVisibilityToggle(record._id)}
          />
          {record.hide ? (
            <Tag color="red">Hidden</Tag>
          ) : (
            <Tag color="green">Visible</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/editProduct/${record?._id}`}>
            <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this product?"
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

  // 🔍 Search filter
  const searchedProducts = products.filter((product) =>
    product.prd_Name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 📌 Grouping
  const inStockProducts = searchedProducts.filter((p) => p.status);
  const outOfStockProducts = searchedProducts.filter((p) => !p.status);
  const visibleProducts = searchedProducts.filter((p) => !p.hide);
  const hiddenProducts = searchedProducts.filter((p) => p.hide);

  // Apply filter
  const getFilteredData = () => {
    switch (filterType) {
      case "inStock":
        return inStockProducts;
      case "outStock":
        return outOfStockProducts;
      case "visible":
        return visibleProducts;
      case "hidden":
        return hiddenProducts;
      default:
        return searchedProducts;
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <Search
          placeholder="Search product by name"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          allowClear
          style={{ width: 250 }}
        />
        <div className="flex gap-3">
          <CustomButton
            label="Bulk Upload"
            onClick={() => setBulkModalOpen(true)}
          />

          <CustomButton
            onClick={() => navigate("/addProduct")}
            label="Add Product"
            variant="add"
          />
        </div>
      </div>
      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />

      {/* 🚀 Filter Buttons */}
      <div className="flex flex-wrap gap-3 ">
        <CustomButton
          label={`All (${searchedProducts.length})`}
          onClick={() => setFilterType("all")}
          variant={filterType === "all" ? "save" : "default"}
        />
        <CustomButton
          label={`In Stock (${inStockProducts.length})`}
          onClick={() => setFilterType("inStock")}
          variant={filterType === "inStock" ? "save" : "default"}
        />
        <CustomButton
          label={`Out of Stock (${outOfStockProducts.length})`}
          onClick={() => setFilterType("outStock")}
          variant={filterType === "outStock" ? "save" : "default"}
        />
        <CustomButton
          label={`Visible (${visibleProducts.length})`}
          onClick={() => setFilterType("visible")}
          variant={filterType === "visible" ? "save" : "default"}
        />
        <CustomButton
          label={`Hidden (${hiddenProducts.length})`}
          onClick={() => setFilterType("hidden")}
          variant={filterType === "hidden" ? "save" : "default"}
        />
      </div>

      <Table columns={columns} dataSource={getFilteredData()} rowKey="_id" />
    </div>
  );
};

export default ProductsList;
