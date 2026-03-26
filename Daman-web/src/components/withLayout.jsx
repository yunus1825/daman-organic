// withLayout.js
import React from "react";
import Header from "./global/Header";
import Footer from "./global/Footer";

const withLayout = (WrappedComponent) => {
  return function LayoutComponent(props) {
    return (
      <>
        <Header />
        <main>
          <WrappedComponent {...props} />
        </main>
        <Footer />
      </>
    );
  };
};

export default withLayout;
