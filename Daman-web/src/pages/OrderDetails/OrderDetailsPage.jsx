import React from "react";

import withLayout from "../../components/withLayout.jsx";
import OrderDetailsContainer from "./components/OrderDetailsContainer.jsx";
import Breadcrumb from "../../components/BreadCrumb.jsx";

const OrderDetailsPage = () => {
  return (
    <div className="container overflow-hidden">
      <Breadcrumb />
      <OrderDetailsContainer></OrderDetailsContainer>
    </div>
  );
};

export default withLayout(OrderDetailsPage);
