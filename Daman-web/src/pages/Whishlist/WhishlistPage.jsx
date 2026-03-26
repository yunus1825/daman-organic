import React from "react";
import Breadcrumb from "../../components/BreadCrumb";
import withLayout from "../../components/withLayout";
import WhishlistContainer from "./components/WhishlistContainer";

const WhishlistPage = () => {
  return (
    <div>
      <div className="container">
        <Breadcrumb></Breadcrumb>
        <div className="my-10">
          <WhishlistContainer></WhishlistContainer>
        </div>
      </div>
    </div>
  );
};

export default withLayout(WhishlistPage);
