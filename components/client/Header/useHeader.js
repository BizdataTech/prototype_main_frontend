import { useState, useEffect } from "react";

export const useHeader = () => {
  const [categories, setCategories] = useState([]);
  const [rootCategories, setRootCategories] = useState(null);
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        let response = await fetch(
          `${BACKEND_API_URL}/api/auto-categories?filter=all`,
          {
            method: "GET",
          }
        );
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);
        else {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    // Filter level 1 or parent-less categories as root categories
    const roots = categories.filter((c) => !c.parent || c.level === 1);
    const tree = roots.map((root) => {
      const children = categories.filter(
        (c) => c.parent && (c.parent._id === root._id || c.parent === root._id)
      );
      const childrenWithSubs = children.map((child) => {
        const subSub = categories.filter(
          (c) => c.parent && (c.parent._id === child._id || c.parent === child._id)
        );
        return { ...child, subcategories: subSub };
      });
      return { ...root, subcategories: childrenWithSubs };
    });
    setRootCategories(tree);
  }, [categories]);

  return { rootCategories, categories };
};
