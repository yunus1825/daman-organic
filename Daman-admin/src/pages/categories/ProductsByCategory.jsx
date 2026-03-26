import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Image } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";

import {
  fetchProductsByCategory,
  updateCategoryProductOrder,
} from "../../redux/slices/productsByCategorySlice";

const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const { id } = useParams();
  const onDragStart = () => setIsDragging(true);
  const { products, loading, error } = useSelector(
    (store) => store.productsByCategory
  );

  const [localProducts, setLocalCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProductsByCategory(id));
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      setLocalCategories(products);
    }
  }, [products]);

  // Handle drag end
  const handleDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;

    const reordered = Array.from(localProducts);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setLocalCategories(reordered);
    dispatch(updateCategoryProductOrder({ id, reorderedProducts: reordered }));
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
  ];

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <div className="mb-10">
      <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <Table
              columns={columns}
              dataSource={localProducts}
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
                    const index = localProducts.findIndex(
                      (c) => c._id === recordId
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
