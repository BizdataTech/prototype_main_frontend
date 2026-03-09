import { MagnifyingGlass } from "phosphor-react";

const SearchSection = ({ placeholder }) => {
  return (
    <div className="relative w-3/6  bg-neutral-200 ">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full text-[1.4rem] outline-none p-4"
      />
      <MagnifyingGlass className="absolute top-[50%] -translate-y-[50%] right-4 w-[1.5rem] h-[1.5rem]" />
    </div>
  );
};

export default SearchSection;
