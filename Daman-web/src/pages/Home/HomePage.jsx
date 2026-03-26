import React from "react";
import withLayout from "../../components/withLayout";
import CategoriesContainer from "./components/CategoriesContainer";
import Carousal from "../../components/global/Carousal";
import ProductsGrid from "./components/ProductsGrid";
import LocationModal from "../../features/LocationModal";
import Ribbon from "../../components/global/Ribbon";
import CategoriesContainerWithImages from "./components/CategoriesContainerWithImages";
import { useSelector } from "react-redux";
import SearchInputMobile from "./components/SearchInputMobile";

const HomePage = () => {
  const { homeSections, loading } = useSelector((state) => state.homeSections);
  return (
    <div>
      <Ribbon></Ribbon>
      {/* <CategoriesContainer></CategoriesContainer> */}
      <div className="container">
        <div className="mb-5">
          <Carousal></Carousal>
        </div>
        <CategoriesContainerWithImages></CategoriesContainerWithImages>
        {homeSections?.map((section, i) => {
          return (
            <ProductsGrid
              key={i}
              heading={section?.section_name}
              products={section?.products}
              loading={loading}
            ></ProductsGrid>
          );
        })}
      </div>
    </div>
  );
};

export default withLayout(HomePage);
