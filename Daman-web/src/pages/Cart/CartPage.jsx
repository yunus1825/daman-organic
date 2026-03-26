import React from "react";
import withLayout from "../../components/withLayout";
import Breadcrumb from "../../components/BreadCrumb";
import CartContainer from "./components/CartContainer";

const CartPage = () => {
  return (
    <div>
      <div className="container">
        <Breadcrumb></Breadcrumb>
        <CartContainer></CartContainer>
      </div>
    </div>
  );
};

export default withLayout(CartPage);
