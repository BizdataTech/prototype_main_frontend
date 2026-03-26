import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const useProducts = (id = null) => {
  const [product, setProduct] = useState(null);
  const [updateData, setUpdateData] = useState({});

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  // input field schema
  let generalDataSchema = {
    product_title: "",
    description: "",
    price: 0,
    stock: 0,
  };

  // attribute fields
  const [attributes, setAttributes] = useState(null);

  // handle input fields
  let [generalData, setGeneralData] = useState(generalDataSchema);
  let [attributeValues, setAttributeValues] = useState({});

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
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    let getProduct = async () => {
      try {
        let res = await axios.get(`${BACKEND_URL}/api/products/${id}`, {
          withCredentials: true,
        });
        console.log("proudct update data:", res.data.product);
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (id) getProduct();
  }, []);

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

  useEffect(() => {
    const getCategoryAttributes = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/categories/${selectedCategory._id}/attribute-collections`,
          { withCredentials: true },
        );
        setAttributes(res.data.attributes);

        if (selectedCategory._id !== product.category._id)
          setAttributeValues({});
        else setAttributeValues(product.attributes);
        // when category is changed, category attributes are refetched all the time. but the product's attribute value for update stays same.
      } catch (err) {
        console.log(err.message);
      }
    };

    if (selectedCategory) getCategoryAttributes();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      let response = await fetch(
        `http://localhost:4000/api/products?filter=admin-products&current_page=${currentPage}`,
        {
          method: "GET",
        },
      );
      let data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setProducts(data.products);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  const handleCategory = (category) => {
    setSelectedCategory(category);
    if (product)
      setUpdateData((prev) => {
        let new_update = { ...prev };
        delete new_update.attributes;
        if (category._id !== product.category._id)
          new_update.category = category._id;
        else delete new_update.category;
        return new_update;
      });
    setErrors((prev) => {
      let { category, ...rest } = prev;
      return rest;
    });
  };

  const handleBrand = (brand) => {
    setSelectedBrand(brand);
    if (product && brand._id !== product.brand._id)
      setUpdateData((prev) => ({
        ...prev,
        brand: brand._id,
      }));
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

  useEffect(() => {
    if (!product) return;
    let { product_title, description, price, stock, ...rest } = product;
    setGeneralData({
      product_title,
      description,
      price: String(price),
      stock,
    });
    setSelectedCategory(rest.category);
    setSelectedBrand(rest.brand);
    setAttributeValues(rest.attributes);
    setImages(rest.images);
  }, [product]);

  let handleInput = (event) => {
    let { name, value } = event.target;
    setGeneralData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (product)
      setUpdateData((prev) => {
        let new_update = { ...prev };
        if (value.trim() === String(product[name])) delete new_update[name];
        else new_update[name] = value;
        return new_update;
      });
    if (value.trim().length) {
      setErrors((prev) => {
        let { [name]: _, ...rest } = prev;
        return rest;
      });
    }
    return;
  };

  const handleAttributeInputFields = (e) => {
    let { name, value } = e.target;
    setAttributeValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (product) {
      setUpdateData((prev) => {
        let new_update = { ...prev };
        new_update.attributes = new_update.attributes || {};
        if (value === product.attributes[name])
          delete new_update.attributes[name];
        else new_update.attributes[name] = value;

        if (!Object.keys(new_update.attributes).length)
          delete new_update.attributes;
        return new_update;
      });
    }
  };

  const handleImages = (image_object) => {
    setImages((prev) => [...prev, image_object]);
    if (product)
      setUpdateData((prev) => ({
        ...prev,
        images: [...(prev.images || []), image_object.file],
      }));
    if (!images.length)
      return setErrors((prev) => {
        let { images, ...rest } = prev;
        return rest;
      });
  };

  const cancelImages = (image) => {
    setImages((prev) =>
      prev.filter((obj) => {
        if (image.public_id) return obj.public_id !== image.public_id;
        return obj.preview !== image.preview;
      }),
    );

    if (image.public_id)
      setUpdateData((prev) => ({
        ...prev,
        cancelledPubliIds: [...(prev.cancelledPubliIds || []), image.public_id],
      }));
    else
      setUpdateData((prev) => {
        let new_update = { ...prev };
        new_update.images = new_update.images.filter(
          (imgFile) => imgFile !== image.file,
        );
        if (!new_update.images.length) delete new_update.images;
        return new_update;
      });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let product_update = false;
    if (product_update) {
      console.log("update data:", updateData);
      return;
    }

    let error_obj = {};
    let data = {
      ...generalData,
      attributes: attributeValues,
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
    let res;
    try {
      if (product) {
        Object.entries(updateData).forEach(([key, value]) => {
          if (["category", "brand"].includes(key)) formData.append(key, value);
          else if (key === "images")
            value.forEach((file) => formData.append("image", file));
          else if (typeof value === "object")
            formData.append(key, JSON.stringify(value));
          else formData.append(key, value);
        });

        setLoading(true);
        res = await axios.patch(
          `${BACKEND_URL}/api/products/${product._id}`,
          formData,
          {
            withCredentials: true,
          },
        );
        setLoading(false);
        toast.success(res.data?.message || "Product Updated");
        router.replace("/admin/products");
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (key === "category" || key === "brand") {
            formData.append(key, value._id);
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else formData.append(key, value.trim());
        });
        images.forEach((image) => formData.append("image", image.file));

        setLoading(true);
        res = await axios.post(`${BACKEND_URL}/api/products`, formData, {
          withCredentials: true,
        });
        setLoading(false);
        toast.success(res.data?.message || "Product Created");
        router.push("/admin/products");
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  return {
    refetch: fetchProducts,
    data: {
      generalData,
      handleInput,
    },
    images,
    handleImages,
    cancelImages,
    controlPage,
    currentPage,
    totalPages,
    brands,
    selectedBrand,
    handleBrand,
    categories,
    selectedCategory,
    attributes,
    attributeValues,
    handleAttributeInputFields,
    handleCategory,
    products,
    vehicle_utility_object: {},
    getChildCategories,
    handleSubmit,
    loading,
    errors,
  };
};

export default useProducts;
