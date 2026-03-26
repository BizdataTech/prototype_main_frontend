import useMouseClick from "@/app/(admin)/hooks/useMouseClick";
import { InputLabel } from "@/components/admin/InputLabel";
import axios from "axios";
import { ArrowLeft } from "phosphor-react";
import { useEffect, useRef, useState } from "react";

const Category = ({ selectedCategory, setCategory, error }) => {
  let [categories, setCategories] = useState([]);

  let [history, setHistory] = useState([]);
  let currentCategories = history[history.length - 1];

  let [box, setBox] = useState(false);
  let boxRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    let getCategories = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/auto-categories?filter=section-block`,
        );
        setCategories(res.data?.categories);
      } catch (err) {
        console.log(err.message);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    setHistory([{ categories: categories.filter((cata) => cata.level === 1) }]);
  }, [categories]);

  useEffect(() => {
    setBox(false);
  }, [selectedCategory]);

  useMouseClick(boxRef, () => setBox(false));

  const handleBack = () => {
    setHistory((prev) => {
      let new_history = prev.slice(0, -1);
      return new_history;
    });
  };

  const handleClick = (category) => {
    let children = categories.filter((cata) => cata.parent === category._id);
    if (children.length)
      return setHistory((prev) => [...prev, { categories: children }]);
    setCategory(category);
  };

  return (
    <div className="flex flex-col gap-1">
      <InputLabel label={"Product Category"} error={error} />
      <div className="relative" onClick={() => setBox(true)}>
        <div className="a-input cursor-pointer">
          {selectedCategory ? selectedCategory.title : "Select One Category"}
        </div>
        {box && (
          <div
            className="absolute left-0 right-0 bg-white z-100 border border-neutral-300 shadow-md p-2"
            ref={boxRef}
          >
            {history.length > 1 && (
              <ArrowLeft
                className="w-[1.5rem] h-[1.5rem] cursor-pointer mb-2"
                onClick={handleBack}
              />
            )}
            {currentCategories.categories.map((cata) => (
              <div
                key={cata._id}
                className="text-[1.4rem] hover:bg-neutral-100 transition-colors cursor-pointer p-2"
                onClick={() => handleClick(cata)}
              >
                {cata.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
