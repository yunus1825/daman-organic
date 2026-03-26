// src/pages/MyAccountPage.jsx
import React from "react";
// import your actual section‑components:

import withProfileLayout from "../../components/withAccountLayout";
import withLayout from "../../components/withLayout";
import Breadcrumb from "../../components/BreadCrumb";
import CartContainer from "../Cart/components/CartContainer";
import WhishlistContainer from "../Whishlist/components/WhishlistContainer";
import MyOrdersContainer from "../Features/MyOrdersContainer";
import AddressContainer from "../Features/AddressContainer";

// 1) Create a small “router” component that picks which section to show:
function ProfileContent({ active }) {
  switch (active) {
    case "cart":
      return <CartContainer />;
    case "wishlist":
      return <WhishlistContainer />;
    case "orders":
      return <MyOrdersContainer />;
    case "address":
      return <AddressContainer />;
    default:
      return <div>unknown</div>;
  }
}

// 2) Wrap it in the HOC:
const EnhancedAccount = withProfileLayout(ProfileContent);

// 3) Put it all together in your page:
const ProfilePage = () => {
  return (
    <div className="container overflow-hidden">
      <Breadcrumb />
      <EnhancedAccount />
    </div>
  );
};
export default withLayout(ProfilePage);
