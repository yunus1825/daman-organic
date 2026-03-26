import React, { useEffect } from "react";
import ProductItem1 from "../../../components/ProductItems/ProductItem1";
import { useDispatch, useSelector } from "react-redux";
import ProductItem1Shrimmer from "../../../components/shrimmers/ProductItem1Shrimmer";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { fetchProductsByCategory } from "../../../redux/slices/productsByCategorySlice";

const CategoryProducts = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("id");
  const { products, loading, error, page, totalPages } = useSelector(
    (state) => state.productsByCategory
  );

  // useEffect(() => {
  //   dispatch(fetchProductsByCategory({ categoryId, page: 1 }));
  // }, [categoryId, dispatch]);

  const fetchMoreData = () => {
    if (page < totalPages) {
      dispatch(fetchProductsByCategory({ categoryId, page: page + 1 }));
    }
  };

  // Show shimmer while loading
  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <ProductItem1Shrimmer key={`shimmer-${i}`} />
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  // Show empty state if no products
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No products found in this category.</p>
      </div>
    );
  }

  // Render actual products
  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchMoreData}
      hasMore={page < totalPages}
      className="no-scrollbar "
      loader={
        <div className="grid grid-cols-2 mt-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(2)].map((_, i) => (
            <ProductItem1Shrimmer key={`shimmer-${i}`} />
          ))}
        </div>
      }
      endMessage={
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            No more products
          </p>
        </div>
      }
      scrollableTarget="products-scrollable" // ✅ tell InfiniteScroll where to listen
    >
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 no-scrollbar">
        {products.map((product, i) => (
          <ProductItem1 key={`product-${product._id}-${i}`} product={product} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default CategoryProducts;
