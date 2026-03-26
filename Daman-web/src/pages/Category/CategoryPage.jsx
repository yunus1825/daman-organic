import React, { useEffect, useState } from "react";
import withLayout from "../../components/withLayout";
import Breadcrumb from "../../components/BreadCrumb";
import { IoFilterOutline } from "react-icons/io5";
import CategorySideBar from "./components/CategorySideBar";
import CategoryProducts from "./components/CategoryProducts";

const CategoryPage = () => {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, []);
  const [breadCrumbHeight, setBreadCrumbHeight] = useState(0);

  useEffect(() => {
    const breadcrumb = document.getElementById("site-bread-crumb");
    if (breadcrumb) {
      setBreadCrumbHeight(breadcrumb.offsetHeight);
    }
  }, []);
  console.log(headerHeight, breadCrumbHeight);
  return (
    <div>
      <div className="container">
        <div className="flex justify-between items-center">
          <Breadcrumb />
        </div>

        <div
          className="grid grid-cols-12 gap-1 mt-4"
          style={{
            height: `calc(100vh - ${headerHeight + breadCrumbHeight + 50}px)`,
            overflow: "hidden",
          }}
        >
          {/* set a height, adjust calc(...) as per your header/footer */}

          <div className=" col-span-3 border-2 border-gray-300 rounded-sm overflow-y-auto no-scrollbar">
            <CategorySideBar />
          </div>

          <div
            id="products-scrollable"
            className="col-span-9 overflow-y-auto no-scrollbar"
            style={{
              height: `calc(100vh - ${headerHeight + breadCrumbHeight + 50}px)`,
            }}
          >
            <CategoryProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(CategoryPage);
