import React from "react";
import ProductsGrid from "../Home/components/ProductsGrid";
import Breadcrumb from "../../components/BreadCrumb";
import withLayout from "../../components/withLayout";
import ProductDisplay from "./components/ProductDisplay.jsx";
import { useSelector } from "react-redux";
const ProductDetailsPage = () => {
  const { homeSections } = useSelector((state) => state.homeSections);
  return (
    <div>
      <div className="container">
        <Breadcrumb></Breadcrumb>
        <ProductDisplay />
        {homeSections?.map((section, i) => {
          return (
            <ProductsGrid
              key={i}
              heading={section?.section_name}
              products={section?.products}
            ></ProductsGrid>
          );
        })}
      </div>
    </div>
  );
};

export default withLayout(ProductDetailsPage);
