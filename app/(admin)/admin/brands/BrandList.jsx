const BrandList = ({ brands }) => {
  return (
    <section className="w-4/6 flex flex-col gap-4 a-section--box self-start">
      {brands.length ? (
        <div className="grid grid-cols-7 gap-4">
          {brands.map((brand) => (
            <div className="bg-white">
              <img
                src={brand.image}
                alt="brand image"
                className="w-full h-full object-contain"
              />
              <div className="text-[1.4rem] font-medium text-center mt-2">
                {brand.brand_name}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-[3rem] bg-white">
          <div className="text-[2rem] font-medium">No Brand to List</div>
          <div className="text-[1.4rem]">
            Cannot find any brands. Create brands above.
          </div>
        </div>
      )}
    </section>
  );
};

export default BrandList;
