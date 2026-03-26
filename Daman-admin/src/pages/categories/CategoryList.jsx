import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Image, Popconfirm, Switch, Tag, Input } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";
import {
  deleteCategory,
  fetchCategories,
  updateCategoryOrder,
  updateCategoryStatus,
} from "../../redux/slices/categorySlice";

const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = () => setIsDragging(true);
  const { categories, loading, error } = useSelector((store) => store.category);

  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories) {
      setLocalCategories(categories);
    }
  }, [categories]);

  const handleDelete = (record) => {
    dispatch(deleteCategory(record._id));
  };

  const handleVisibilityToggle = (categoryId, currentStatus) => {
    dispatch(
      updateCategoryStatus({
        id: categoryId,
        status: !currentStatus,
      }),
    );
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;

    const reordered = Array.from(localCategories);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setLocalCategories(reordered);
    dispatch(updateCategoryOrder(reordered));
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "CategoryName",
      key: "CategoryName",
    },
    {
      title: "Image",
      dataIndex: "Image",
      key: "Image",
      render: (image) => <Image src={image} width={50} height={50} />,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={record.status}
            onChange={() => handleVisibilityToggle(record._id, record.status)}
          />

          {record.status ? (
            <Tag color="green">Visible</Tag>
          ) : (
            <Tag color="red">Hidden</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/editCategory/${record?._id}`}>
            <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} />
          </Link>

          <Popconfirm
            title="Are you sure to delete this category?"
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
          <Link to={`/categoryProducts/${record?._id}`}>
            <button className="px-2 py-1 text-xs font-medium cursor-pointer text-white bg-green-500 rounded hover:bg-green-600">
              View Products
            </button>
          </Link>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div className="mb-10">
      <div className="flex justify-end mb-3">
        <CustomButton
          onClick={() => navigate("/addCategory")}
          label={"Add Category"}
          variant="add"
        />
      </div>

      <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <Table
              columns={columns}
              dataSource={localCategories}
              rowKey="_id"
              pagination={false}
              components={{
                body: {
                  wrapper: (props) => (
                    <tbody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      {...props}
                    >
                      {props.children}
                      {provided.placeholder}
                    </tbody>
                  ),
                  row: ({ children, ...restProps }) => {
                    const recordId = restProps["data-row-key"]; // ✅ comes from rowKey="_id"
                    const index = localCategories.findIndex(
                      (c) => c._id === recordId,
                    );

                    if (!recordId) return <tr {...restProps}>{children}</tr>; // fallback

                    return (
                      <Draggable
                        draggableId={restProps["data-row-key"]}
                        index={index}
                        isDragDisabled={
                          isDragging && /* prevent new items */ true
                        }
                      >
                        {(dragProvided) => (
                          <tr
                            {...restProps}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            {children}
                          </tr>
                        )}
                      </Draggable>
                    );
                  },
                },
              }}
            />
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CategoryList;
