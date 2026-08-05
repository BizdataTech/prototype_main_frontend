const ProductlistSidebar = ({ sidebar, filterProducts }) => {
  return (
    <div className="w-[20%] bg-white p-6 rounded-[.4rem] space-y-8">
      {sidebar.map((content, index) => {
        if (content.data) {
          return (
            <div key={content.label || index} className="flex flex-col gap-[.5rem]">
              <h3 className="text-[1.5rem] capitalize font-medium text-gray-900">
                {content.head}
              </h3>
              <ul className="flex flex-col">
                {content.data.map((d, dIdx) => (
                  <label key={dIdx} className="flex gap-4 items-center cursor-pointer">
                    <input
                      name={content.label}
                      type="checkbox"
                      onChange={filterProducts}
                      value={d}
                      multiple={false}
                    />
                    <li
                      className={`text-[1.5rem] text-gray-500 font-medium  py-[.3rem] `}
                    >
                      {d}
                    </li>
                  </label>
                ))}
              </ul>
            </div>
          );
        }
      })}
      <div className="space-y-[1rem]">
        <div className="shimmer w-[50%]"></div>
        <div className="space-y-2">
          {Array(4)
            .fill(undefined)
            .map((_, shimmerIdx) => (
              <div key={shimmerIdx} className="shimmer w-full"></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductlistSidebar;
