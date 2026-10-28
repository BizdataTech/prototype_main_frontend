import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const useCategories = () => {
  const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);
  const [actualCategoryTitle, setActualCategoryTitle] = useState("");
  const [categoryTitle, setCategoryTitle] = useState("");
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [errors, setErrors] = useState({});

  const [navbar, setNavbar] = useState(false);

  // New state variables for extended category fields
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active"); // Defaults to Active
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImage("");
    }
  };

  const [attributeCollection, setAttributeCollection] = useState(null);

  // Variants mapping
  const [globalVariants, setGlobalVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);

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
        const {
          title,
          level,
          parent,
          slug,
          description,
          status,
          image,
          variants,
        } = data.category;
        setActualCategoryTitle(title);
        setCategoryTitle(title);
        setSelectedLevel(level);
        setSelectedParent(parent ? parent._id : null);
        setParents(data.parents);
        setSlug(slug || "");
        setDescription(description || "");
        setStatus(status || "Active");
        setImage(image || "");
        setImagePreview(image || "");
        setSelectedVariants(variants || []);
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
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/auto-categories?filter=all&current_page=${currentPage}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
        setTotalPages(data.total_pages);
      } else throw new Error(data.message);
    } catch (err) {
      console.error("fetchCategories error:", err);
    }
  };

  useEffect(() => {
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

    async function fetchVariants() {
      const response = await fetch(`${BACKEND_API_URL}/api/variants`);
      const data = await response.json();
      if (response.ok) {
        setGlobalVariants(data.variants || []);
      }
    }
    fetchVariants();
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
      let response;
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", categoryTitle);
        formData.append("level", selectedLevel);
        formData.append("isNavItem", navbar);
        if (selectedParent) formData.append("parent", selectedParent);
        if (attributeCollection)
          formData.append("attribute_collection", attributeCollection);
        if (slug) formData.append("slug", slug);
        if (description) formData.append("description", description);
        if (status) formData.append("status", status);
        formData.append("image", imageFile);
        formData.append("variants", JSON.stringify(selectedVariants || []));

        if (action === "create") {
          response = await fetch(`${BACKEND_API_URL}/api/auto-categories`, {
            method: "POST",
            body: formData,
          });
        } else if (action === "update") {
          response = await fetch(
            `${BACKEND_API_URL}/api/auto-categories/${category_id}`,
            {
              method: "PUT",
              body: formData,
            },
          );
        }
      } else {
        const data = {
          title: categoryTitle,
          level: selectedLevel,
          isNavItem: navbar,
          parent: selectedParent,
          attribute_collection: attributeCollection,
          slug,
          description,
          status,
          image,
          variants: selectedVariants,
        };
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
        `${BACKEND_API_URL}/api/auto-categories/${deleteid}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();
      if (response.ok && data.success !== false) {
        if (data.delete) {
          toast.success(data.message || "Category deleted successfully");
          const deletedSet = new Set(data.deletedIds || [deleteid]);
          setSelectedCategories((prev) =>
            prev.filter((item) => !deletedSet.has(item)),
          );
          if (data.categories) {
            setCategories(data.categories);
          } else {
            fetchCategories();
          }
          if (action === "update") router.push("/admin/categories");
        } else {
          toast.error(data.message || "Failed to delete category");
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("error:", error.message);
      toast.error(error.message || "Failed to delete category");
    }
  };

  const bulkDeleteCategories = async () => {
    if (!selectedCategories || selectedCategories.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedCategories.length} selected category(ies)? All associated subcategories will also be deleted from the database.`,
      )
    )
      return;
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/auto-categories/bulk-delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedCategories }),
        },
      );
      const data = await response.json();
      if (response.ok && data.success !== false) {
        toast.success(
          data.message || "Categories and subcategories deleted successfully",
        );
        const deletedSet = new Set(data.deletedIds || selectedCategories);
        setSelectedCategories((prev) =>
          prev.filter((id) => !deletedSet.has(id)),
        );
        if (data.categories) {
          setCategories(data.categories);
        } else {
          fetchCategories();
        }
      } else {
        toast.error(data.message || "Failed to delete categories");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error(error.message || "Failed to delete categories");
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
    selectedCategories,
    setSelectedCategories,
    bulkDeleteCategories,
    fetchCategories,
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
    slug,
    setSlug,
    description,
    setDescription,
    status,
    setStatus,
    image,
    setImage,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    handleImageFile,
    globalVariants,
    selectedVariants,
    setSelectedVariants,
  };
};

export default useCategories;
