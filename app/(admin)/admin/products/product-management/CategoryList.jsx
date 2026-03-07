import { useState } from "react";
import useProducts from "../useProducts";

const CategoryList = ({ utils }) => {
  const { categories, handleCategory, handleIsOpen } = utils;
  const { getChildCategories } = useProducts();
  const [history, setHistory] = useState([{ categories: categories }]);
  let currentCategories = history[history.length - 1];

  const getChildrens = (category) => {
    const childrens = getChildCategories(category._id);
    if (childrens.length > 0)
      setHistory((prevHistory) => [...prevHistory, { categories: childrens }]);
    else {
      handleCategory(category);
      handleIsOpen();
    }
  };
  const handleBackButton = () => {
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  return (
    <div className="absolute w-full shadow-sm bg-white p-4">
      {history.length > 1 && (
        <div
          className="cursor-pointer text-[1.4rem] p-2"
          onClick={handleBackButton}
        >
          {`<- Back`}
        </div>
      )}
      {currentCategories.categories.map((category, index) => (
        <div
          key={index}
          className="p-2 text-[1.4rem] hover:bg-neutral-100 rounded-[.2rem] cursor-pointer"
          onClick={() => getChildrens(category)}
        >
          {category.title}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
