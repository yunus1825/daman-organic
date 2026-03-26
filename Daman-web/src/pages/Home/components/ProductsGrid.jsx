import ProductItem1 from "../../../components/ProductItems/ProductItem1";

const ShimmerCard = () => (
  <div className="animate-pulse rounded-lg bg-gray-200 h-[400px] w-full"></div>
);

const ProductsGrid = ({
  heading = "section title",
  products = [],
  loading,
}) => {
  if (!loading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex items-center justify-start">
            <h3 className="uppercase font-bold md:text-xl">{heading}</h3>
            <div className="h-[2px] flex-[0.9] bg-gradient-to-r from-[lightgray] via-[lightgray] to-transparent mx-auto" />
          </div>
        </div>

        {/* products OR shimmer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ShimmerCard key={i} />)
            : products.map((product, i) => (
                <ProductItem1 key={i} product={product} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
