import React, { useEffect } from "react";
import Loader from "../../components/Loader";
import ErrorComponent from "../../components/ErrorComponent";
import {
  deleteHomeSection,
  fetchHomeSections,
} from "../../redux/slices/homeSectionSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../globalComponents/CustomButton";

const HomeSectionsList = () => {
  const dispatch = useDispatch();

  const { homeSections, loading, error } = useSelector(
    (store) => store.homeSections
  );
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchHomeSections());
  }, [dispatch]);
  const onEditSection = () => {};
  const onEditProduct = () => {};
  const onDeleteProduct = () => {};
  // Handle delete action
  const onDeleteSection = (id) => {
    dispatch(deleteHomeSection(id));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorComponent message={error} />;
  return (
    <div className="container mx-auto">
      <div className="flex justify-end">
        <CustomButton
          label={"Add Section"}
          variant="add"
          onClick={() => navigate("/AddSection")}
          styles="mt-0 mb-2"
        ></CustomButton>
      </div>

      {homeSections?.map((section) => (
        <div
          key={section._id}
          className="mb-12 bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
        >
          {/* Section Header */}
          <div className="flex justify-between items-center bg-primary p-6">
            <div>
              <h2 className="text-sm sm:text-2xl font-semibold text-white">
                {section.section_name}
              </h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/EditSection/${section?._id}`)}
                className="px-2 py-1 sm:px-4 sm:py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base"
              >
                Edit Section
              </button>
              <button
                onClick={() => onDeleteSection(section._id)}
                className="px-2 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Delete Section
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Products ({section.products?.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.prd_Name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {product.prd_Name}
                      </h4>
                      <div className="text-right">
                        <span className="text-gray-500 line-through mr-2">
                          ₹{product.display_price}
                        </span>
                        <span className="text-green-600 font-bold">
                          ₹{product.selling_price}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {product.categoryName}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {product.quantity} {product.Type}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {product.customId}
                      </span>
                    </div>

                    {product.variants?.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Variants:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((variant, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                            >
                              {variant.quantity} {variant.Type} - ₹
                              {variant.selling_Price}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSectionsList;
