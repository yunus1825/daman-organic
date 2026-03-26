import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Image, Popconfirm } from "antd";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ErrorComponent from "../../components/ErrorComponent";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../globalComponents/CustomButton";
import {
  deleteSlider,
  fetchSliders,
  updateSliderOrder,
} from "../../redux/slices/sliderSlice";
import Loader from "../../components/Loader";

const SlidersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { sliders, loading, error } = useSelector((store) => store.sliders);

  const [localSliders, setLocalSliders] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  useEffect(() => {
    if (sliders) {
      setLocalSliders(sliders);
    }
  }, [sliders]);

  const onDragStart = () => setIsDragging(true);

  const handleDragEnd = (result) => {
    setIsDragging(false);

    if (!result.destination) return;

    const reordered = Array.from(localSliders);
    const [moved] = reordered.splice(result.source.index, 1);

    reordered.splice(result.destination.index, 0, moved);

    setLocalSliders(reordered);
    dispatch(updateSliderOrder(reordered));
  };

  const handleDelete = (record) => {
    dispatch(deleteSlider(record._id));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "Tittle",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "Image",
      key: "image",
      render: (image) => <Image src={image} height={50} />,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Link to={`/EditSlider/${record?._id}`}>
            <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} />
          </Link>

          <Popconfirm
            title="Are you sure to delete this slider?"
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
      <div className="flex justify-end mb-3">
        <CustomButton
          onClick={() => navigate("/AddSlider")}
          label={"Add Slider"}
          variant="add"
        />
      </div>

      <DragDropContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <Table
              columns={columns}
              dataSource={localSliders}
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
                    const recordId = restProps["data-row-key"];

                    const index = localSliders.findIndex(
                      (item) => item._id === recordId,
                    );

                    if (!recordId) return <tr {...restProps}>{children}</tr>;

                    return (
                      <Draggable
                        draggableId={recordId}
                        index={index}
                        isDragDisabled={isDragging && true}
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

export default SlidersList;
