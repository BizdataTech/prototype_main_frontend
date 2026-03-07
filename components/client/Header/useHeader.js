import { useState, useEffect } from "react";

export const useHeader = () => {
  const [categories, setCategories] = useState([]);
  const [rootCategories, setRootCategories] = useState(null);
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        let response = await fetch(
          `${BACKEND_API_URL}/api/categories?filter=all-category`,
          {
            method: "GET",
          }
        );
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);
        else {
          setCategories(data.categories);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const root = categories.filter((cata) => {
      return cata.navbar;
    });
    setRootCategories(root);
  }, [categories]);

  //   generate childrens

  return { rootCategories };
};
