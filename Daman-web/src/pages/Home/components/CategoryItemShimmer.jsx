const CategoryItemShimmer = () => {
  return (
    <div className="min-w-[100px] md:min-w-[220px] flex flex-col justify-center items-center animate-pulse">
      <div className="w-full h-[100px] md:h-[200px] rounded-2xl bg-gray-200" />
      <div className="bg-gray-200 flex mt-3 w-full h-6 rounded-xl" />
    </div>
  );
};

export default CategoryItemShimmer;
