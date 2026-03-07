import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  // ui related variables
  const [apiLoading, setApiLoading] = useState(false);

  // input field schema
  let generalDataSchema = {
    product_title: "",
    description: "",
    price: 0,
    stock: 0,
  };

  let adminFieldSchema = {
    part_number: "",
    oem_number: "",
  };

  // getting all products
  const [products, setProducts] = useState(null);
  let [currentPage, setCurrentPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);

  const controlPage = async (action) => {
    if (action === "up" && currentPage < totalPages)
      setCurrentPage((prevPage) => prevPage + 1);
    else if (action === "down" && currentPage > 1)
      setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await fetch(
          `http://localhost:4000/api/auto-products?filter=admin-products&current_page=${currentPage}`,
          {
            method: "GET",
          },
        );
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);
        else {
          setProducts(data.products);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetch(
        `${BACKEND_URL}/api/auto-categories?filter=product-category`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      setCategories(data.categories);
    };
    getCategories();
  }, []);

  useEffect(() => {
    let getBrands = async () => {
      try {
        let response = await fetch(`${BACKEND_URL}/api/brands`, {
          method: "GET",
        });
        let result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setBrands(result.brands);
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    getBrands();
  }, []);

  const handleCategory = (category) => {
    setSelectedCategory(category);
    setErrors((prev) => {
      let { category, ...rest } = prev;
      return rest;
    });
  };

  const handleBrand = (brand) => {
    setSelectedBrand(brand);
    setErrors((prev) => {
      let { brand, ...rest } = prev;
      return rest;
    });
  };

  const getChildCategories = (id) => {
    return categories.filter((category) => {
      if (category.parent && category.parent._id === id) return category;
    });
  };

  // handle input fields
  let [generalData, setGeneralData] = useState(generalDataSchema);
  let [adminFields, setAdminFields] = useState(adminFieldSchema);

  let handleInput = (event) => {
    let { name, value } = event.target;
    if (Object.keys(generalDataSchema).includes(name))
      setGeneralData((prev) => ({
        ...prev,
        [name]: value,
      }));
    else if (Object.keys(adminFieldSchema).includes(name))
      setAdminFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    if (value.trim().length) {
      setErrors((prev) => {
        let { [name]: _, ...rest } = prev;
        return rest;
      });
    }
    return;
  };

  const handleImages = (image_object) => {
    setImages((prev) => [...prev, image_object]);
    if (!images.length)
      return setErrors((prev) => {
        let { images, ...rest } = prev;
        return rest;
      });
  };

  const createProduct = async () => {
    let error_obj = {};
    let data = {
      ...generalData,
      ...adminFields,
      category: selectedCategory,
      brand: selectedBrand,
    };
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string" && !value.trim())
        error_obj[key] = `${key.split("_").join(" ")} required`;
      else if (typeof value === "number" && value <= 0)
        error_obj[key] = `invalid ${key} entry`;
      else if (value === null) error_obj[key] = "select one value";
    });

    if (!images.length) error_obj.images = "required atleast one image";

    if (Object.keys(error_obj).length)
      return setErrors((prev) => {
        let new_errors = { ...prev };
        Object.entries(error_obj).forEach(([key, value]) => {
          new_errors[key] = value;
        });
        return new_errors;
      });

    let formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "category" || key === "brand") {
        formData.append(key, value._id);
      } else formData.append(key, value.trim());
    });
    images.forEach((image) => formData.append("image", image.file));

    try {
      setApiLoading(true);
      let response = await fetch(`${BACKEND_URL}/api/auto-products`, {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      if (!response.ok) throw new Error(result.message);
      console.log(result.message);
      router.push("/admin/products");
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  const deleteAllProducts = async () => {
    try {
      let response = await fetch(`${BACKEND_URL}/api/products`, {
        method: "DELETE",
      });
      let data = await response.json();
      if (!response.ok) throw new Error(data.message);
      else {
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    data: {
      generalData,
      adminFields,
      handleInput,
    },
    images,
    handleImages,
    controlPage,
    currentPage,
    totalPages,
    deleteAllProducts,
    brands,
    selectedBrand,
    handleBrand,
    categories,
    selectedCategory,
    handleCategory,
    products,
    vehicle_utility_object: {},
    getChildCategories,
    createProduct,
    apiLoading,
    errors,
  };
};

export default useProducts;
