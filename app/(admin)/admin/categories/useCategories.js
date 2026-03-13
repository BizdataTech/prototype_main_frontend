import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const useCategories = () => {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [actualCategoryTitle, setActualCategoryTitle] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [errors, setErrors] = useState({});
  const [navbar, setNavbar] = useState(false);

  const [attributeCollection, setAttributeCollection] = useState(null);

  const router = useRouter();
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const category_id = searchParams.get("category_id");

  // fetching matching category info for updation
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await fetch(
        `${BACKEND_API_URL}/api/auto-categories/${category_id}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (response.ok) {
        const { title, level, parent } = data.category;
        setActualCategoryTitle(title);
        setCategoryTitle(title);
        setSelectedLevel(level);
        setSelectedParent(parent._id);
        setParents(data.parents);
        console.log("parent:", parent);
      }
    };
    if (action === "update") fetchCategory();
  }, []);

  // fetching all categories
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handlePage = (action) => {
    if (action === "up" && currentPage < totalPages)
      setCurrentPage((prevPage) => prevPage + 1);
    else if (action === "down" && currentPage > 1)
      setCurrentPage((prevPage) => prevPage - 1);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        `${BACKEND_API_URL}/api/auto-categories?filter=all&current_page=${currentPage}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log("categories:", data.categories);
        setCategories(data.categories);
        setTotalPages(data.total_pages);
      } else throw new Error(data.message);
    };
    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    async function fetchLevels() {
      const response = await fetch(
        `${BACKEND_API_URL}/api/auto-categories?filter=level`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log("levels:", data.levels);
        setLevels(data.levels);
      }
    }
    fetchLevels();
  }, []);

  const handleCategoryTitle = (value) => {
    setCategoryTitle(value);
    setErrors((prevErrors) => {
      let { categoryTitle, ...rest } = prevErrors;
      if (value.trim().length >= 3) return rest;
      return { ...rest, categoryTitle: "Required atleast 3 character" };
    });
  };

  const handleSelectedLevel = async (level) => {
    setSelectedLevel(level);
    setSelectedParent(null);
    if (level === 1) {
      setErrors((prevErrors) => {
        const { parent, ...rest } = prevErrors;
        return rest;
      });
      setParents([]);
      return;
    }
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/auto-categories?filter=parent&level=${level}`,
        { method: "GET" },
      );
      const data = await response.json();
      if (response.ok) {
        console.log("parents:", data.parentCategories);
        setParents(data.parentCategories);
      } else throw new Error();
      return;
    } catch (error) {
      setError("Network Error, check your internet connection");
      setParents([]);
      return;
    }
  };

  const handleParent = (id) => {
    setSelectedParent(id);
    setErrors((prevErrors) => {
      const { parent, ...rest } = prevErrors;
      return rest;
    });
  };

  const submitCategory = async (event) => {
    let errorObject = {};
    try {
      if (categoryTitle.trim().length < 3)
        errorObject.categoryTitle = "Required atleast 3 character";
      else {
        const response = await fetch(
          `${BACKEND_API_URL}/api/auto-categories?filter=title&title=${categoryTitle}&actual_title=${actualCategoryTitle}`,
          { method: "GET" },
        );
        const data = await response.json();
        if (response.ok) {
          if (data.matchingCategory)
            errorObject.categoryTitle = "Title already taken";
        } else {
          throw new Error(data.message);
        }
      }
      if (selectedLevel !== 1 && !selectedParent)
        errorObject.parent = "Select one parent for this level";
      if (Object.keys(errorObject).length) {
        toast.error("Enter all required data inorder to create a new category");
        return setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          Object.entries(errorObject).forEach(([key, value]) => {
            newErrors[key] = value;
          });
          return newErrors;
        });
      }
      const data = {
        title: categoryTitle,
        level: selectedLevel,
        isNavItem: navbar,
        parent: selectedParent,
        attribute_collection: attributeCollection,
      };
      let response;
      if (action === "create") {
        response = await fetch(`${BACKEND_API_URL}/api/auto-categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else if (action === "update") {
        response = await fetch(
          `${BACKEND_API_URL}/api/auto-categories/${category_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      }

      const responseData = await response.json();
      if (response.ok) {
        toast.success(responseData.message);
        router.push("/admin/categories");
      } else throw new Error(responseData.message);
    } catch (error) {
      console.log("ERROR: ", error.message);
      setError(error.message);
    }
  };

  const deleteCategory = async (id) => {
    let deleteid = id || category_id;
    try {
      const response = await fetch(
        `http://localhost:4000/api/auto-categories/${deleteid}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (response.ok) {
        if (data.delete) {
          setCategories(data.categories);
          toast.success(data.message);
          if (action === "update") router.push("/admin/categories");
        } else toast.error(data.message);
      } else throw new Error(data.message);
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  const deleteAll = async () => {
    const response = await fetch(`${BACKEND_API_URL}/api/categories`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      toast.success("All Categories Deleted");
      setCategories([]);
    }
  };

  return {
    deleteAll,
    action,
    categories,
    currentPage,
    totalPages,
    handlePage,
    actualCategoryTitle,
    categoryTitle,
    handleCategoryTitle,
    levels,
    selectedLevel,
    handleSelectedLevel,
    parents,
    selectedParent,
    handleParent,
    submitCategory,
    deleteCategory,
    setAttributeCollection,
    navbar,
    setNavbar,
    errors,
  };
};

export default useCategories;
