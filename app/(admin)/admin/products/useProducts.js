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
    sale_price: 0,
    stock: 0,
    product_type: "Simple",
    sku: "",
    status: "Active",
  };

  // Category-linked attribute fields (original feature, preserved)
  const [attributes, setAttributes] = useState(null);
  let [attributeValues, setAttributeValues] = useState({});

  // WooCommerce-style: all global variants fetched from /api/variants
  const [allAvailableVariants, setAllAvailableVariants] = useState([]);

  // WooCommerce-style: which variant IDs are currently added to this product
  // Each entry: { variantId, title, color, values (all possible), selectedValues (user-chosen), usedForVariations }
  const [activeAttributes, setActiveAttributes] = useState([]);

  // The generated (or manually added) variation rows
  const [variations, setVariations] = useState([]);

  // handle input fields
  let [generalData, setGeneralData] = useState(generalDataSchema);

  // ─── Cartesian product generator ────────────────────────────────────────────
  const generateCombinations = (arrays) => {
    let results = [{}];
    for (let opts of arrays) {
      if (!opts || opts.length === 0) continue;
      let temp = [];
      for (let acc of results) {
        for (let opt of opts) {
          temp.push({ ...acc, [opt.title]: opt.value });
        }
      }
      results = temp;
    }
    return results.filter((obj) => Object.keys(obj).length > 0);
  };

  // ─── Fetch all global variants on mount ─────────────────────────────────────
  useEffect(() => {
    const fetchAllVariants = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/variants`);
        setAllAvailableVariants(res.data.variants || []);
      } catch (err) {
        console.log("Failed to fetch global variants:", err.message);
      }
    };
    fetchAllVariants();
  }, []);

  // ─── Clear variations when switching away from Variable ──────────────────────
  useEffect(() => {
    if (generalData.product_type !== "Variable") {
      setVariations([]);
      setActiveAttributes([]);
    }
  }, [generalData.product_type]);

  // ─── WooCommerce-style: add an attribute to the product ─────────────────────
  const handleAddAttribute = (variantId) => {
    if (!variantId) return;
    if (activeAttributes.find((a) => a.variantId === variantId)) {
      toast.error("Attribute already added.");
      return;
    }
    const varDef = allAvailableVariants.find((v) => v._id === variantId);
    if (!varDef) return;
    setActiveAttributes((prev) => [
      ...prev,
      {
        variantId,
        title: varDef.title,
        color: varDef.color,
        values: varDef.values, // all available values for this attribute
        selectedValues: [],    // user will choose which ones to use
        usedForVariations: true,
      },
    ]);
  };

  // ─── Remove an attribute from the product ───────────────────────────────────
  const handleRemoveAttribute = (variantId) => {
    setActiveAttributes((prev) => prev.filter((a) => a.variantId !== variantId));
  };

  // ─── Toggle a value inside an attribute (multi-select pills) ────────────────
  const handleToggleAttributeValue = (variantId, value) => {
    setActiveAttributes((prev) =>
      prev.map((a) => {
        if (a.variantId !== variantId) return a;
        const already = a.selectedValues.includes(value);
        return {
          ...a,
          selectedValues: already
            ? a.selectedValues.filter((v) => v !== value)
            : [...a.selectedValues, value],
        };
      })
    );
  };

  // ─── Toggle "Used for Variations" checkbox per attribute ────────────────────
  const handleToggleUsedForVariations = (variantId) => {
    setActiveAttributes((prev) =>
      prev.map((a) =>
        a.variantId === variantId
          ? { ...a, usedForVariations: !a.usedForVariations }
          : a
      )
    );
  };

  // ─── Generate Variations (only when user clicks the button) ─────────────────
  const handleGenerateVariations = () => {
    const forVariations = activeAttributes.filter(
      (a) => a.usedForVariations && a.selectedValues.length > 0
    );

    if (forVariations.length === 0) {
      toast.error(
        "Please add attributes, select values, and enable 'Used for Variations' first."
      );
      return;
    }

    const arrays = forVariations.map((a) =>
      a.selectedValues.map((val) => ({ title: a.title, value: val }))
    );

    const combos = generateCombinations(arrays);

    setVariations((prev) =>
      combos.map((combo) => {
        const existing = prev.find(
          (p) =>
            p.combination &&
            Object.keys(combo).every((k) => p.combination[k] === combo[k])
        );
        return (
          existing || {
            sku: "",
            price: "",
            sale_price: "",
            stock: "",
            status: "Active",
            weight: "",
            barcode: "",
            dimensions: "",
            image: null,
            combination: combo,
          }
        );
      })
    );

    toast.success(`${combos.length} variation(s) generated!`);
  };

  // ─── Getting all products (list page) ────────────────────────────────────────
  const [products, setProducts] = useState(null);
  let [currentPage, setCurrentPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const controlPage = async (action) => {
    if (action === "up" && currentPage < totalPages)
      setCurrentPage((prevPage) => prevPage + 1);
    else if (action === "down" && currentPage > 1)
      setCurrentPage((prevPage) => prevPage - 1);
    else if (typeof action === "number" && action >= 1 && action <= totalPages)
      setCurrentPage(action);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  // ─── Fetch a single product for editing ─────────────────────────────────────
  useEffect(() => {
    let getProduct = async () => {
      try {
        let res = await axios.get(`${BACKEND_URL}/api/products/${id}?admin=true`, {
          withCredentials: true,
        });
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (id) getProduct();
  }, [id]);

  // ─── Fetch categories ────────────────────────────────────────────────────────
  useEffect(() => {
    const getCategories = async () => {
      const response = await fetch(
        `${BACKEND_URL}/api/auto-categories?filter=product-category`,
        { method: "GET" }
      );
      const data = await response.json();
      setCategories(data.categories);
    };
    getCategories();
  }, []);

  // ─── Fetch brands ────────────────────────────────────────────────────────────
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

  // ─── Fetch category-linked attribute collection ──────────────────────────────
  useEffect(() => {
    const getCategoryAttributes = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_URL}/api/categories/${selectedCategory._id}/attribute-collections`,
          { withCredentials: true }
        );
        setAttributes(res.data.attributes);
        if (selectedCategory._id !== product?.category?._id)
          setAttributeValues({});
        else setAttributeValues(product.attributes || {});
      } catch (err) {
        console.log(err.message);
      }
    };

    if (selectedCategory) {
      getCategoryAttributes();
    }
  }, [selectedCategory, product]);

  // ─── Fetch all products (list) ───────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      let url = `${BACKEND_URL}/api/products?filter=admin-products&current_page=${currentPage}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      let response = await fetch(url, { method: "GET" });
      let data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setProducts(data.products);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log("error:", error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${BACKEND_URL}/api/products/${id}`, { withCredentials: true });
      toast.success(res.data.message || "Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const bulkDeleteProducts = async () => {
    if (selectedProducts.length === 0) return;
    try {
      const res = await axios.post(`${BACKEND_URL}/api/products/bulk-delete`, { ids: selectedProducts }, { withCredentials: true });
      toast.success(res.data.message || "Products deleted");
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete products");
    }
  };

  // ─── Populate form when editing an existing product ─────────────────────────
  useEffect(() => {
    if (!product) return;
    let {
      product_title,
      description,
      price,
      sale_price,
      stock,
      sku,
      product_type,
      status,
      ...rest
    } = product;

    setGeneralData({
      product_title: product_title || "",
      description: description || "",
      price: String(price ?? 0),
      sale_price: String(sale_price ?? 0),
      stock: stock ?? 0,
      product_type: product_type || "Simple",
      sku: sku || "",
      status: status || "Active",
    });

    setSelectedCategory(rest.category);
    setSelectedBrand(rest.brand);

    if (rest.attributes && Array.isArray(rest.attributes)) {
      let attVals = {};
      rest.attributes.forEach(
        (attr) =>
          (attVals[attr.attributeId?._id || attr.attributeId] = attr.value)
      );
      setAttributeValues(attVals);
    }

    setImages(rest.images || []);

    // Restore active attributes from saved variantOptions
    if (
      rest.variantOptions &&
      rest.variantOptions.length > 0 &&
      product_type === "Variable"
    ) {
      // We'll rebuild activeAttributes after allAvailableVariants is loaded
      setProduct((p) => ({ ...p, _pendingVarOptions: rest.variantOptions }));
    }

    if (rest.variants) {
      setVariations(rest.variants);
    }
  }, [product]);

  // Once allAvailableVariants are loaded, rebuild activeAttributes for edit mode
  useEffect(() => {
    if (!product?._pendingVarOptions || allAvailableVariants.length === 0)
      return;
    const rebuilt = product._pendingVarOptions
      .map((vo) => {
        const varDef = allAvailableVariants.find(
          (v) => v._id === (vo.variantId?._id || vo.variantId)
        );
        if (!varDef) return null;
        return {
          variantId: varDef._id,
          title: varDef.title,
          color: varDef.color,
          values: varDef.values,
          selectedValues: vo.values || [],
          usedForVariations: true,
        };
      })
      .filter(Boolean);
    if (rebuilt.length > 0) setActiveAttributes(rebuilt);
  }, [allAvailableVariants, product?._pendingVarOptions]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
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
    if (product && brand._id !== product.brand?._id)
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

  let handleInput = (event) => {
    let { name, value } = event.target;
    setGeneralData((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleAttributeInputFields = (e) => {
    let { name, value } = e.target;
    setAttributeValues((prev) => ({ ...prev, [name]: value }));
    if (product) {
      setUpdateData((prev) => {
        let new_update = { ...prev };
        new_update.attributes = new_update.attributes || {};
        new_update.attributes[name] = value;
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
      })
    );

    if (image.public_id)
      setUpdateData((prev) => ({
        ...prev,
        cancelledPubliIds: [
          ...(prev.cancelledPubliIds || []),
          image.public_id,
        ],
      }));
    else
      setUpdateData((prev) => {
        let new_update = { ...prev };
        new_update.images = new_update.images.filter(
          (imgFile) => imgFile !== image.file
        );
        if (!new_update.images.length) delete new_update.images;
        return new_update;
      });
  };

  const [loading, setLoading] = useState(false);

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    let error_obj = {};

    // Build formatted attributes for category-level attributes
    let formattedAttributes = Object.keys(attributeValues)
      .map((key) => ({ attributeId: key, value: attributeValues[key] }))
      .filter(
        (a) => a.value !== undefined && a.value !== null && a.value !== ""
      );

    // Build formatted variantOptions from activeAttributes
    let formattedVariantOptions = activeAttributes.map((a) => ({
      variantId: a.variantId,
      values: a.selectedValues,
    }));

    let data = {
      ...generalData,
      attributes: formattedAttributes,
      variantOptions: formattedVariantOptions,
      category: selectedCategory,
      brand: selectedBrand,
      variants: variations,
    };

    // Validation
    if (!data.product_title.trim()) error_obj.product_title = "Title required";
    if (!data.category) error_obj.category = "Category required";
    if (!data.brand) error_obj.brand = "Brand required";

    if (data.product_type === "Simple") {
      if (!data.sku.trim()) error_obj.sku = "SKU required";
      if (Number(data.price) <= 0) error_obj.price = "Invalid price";
      if (Number(data.stock) < 0) error_obj.stock = "Invalid stock";
    }

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
        // Append update values
        Object.entries(updateData).forEach(([key, value]) => {
          if (["category", "brand"].includes(key)) formData.append(key, value);
          else if (key === "images")
            value.forEach((file) => formData.append("image", file));
          else if (typeof value === "object")
            formData.append(key, JSON.stringify(value));
          else formData.append(key, value);
        });

        if (data.product_type === "Variable") {
          const processedVars = variations.map((v, index) => {
            const copy = { ...v };
            if (copy.image && copy.image instanceof File) {
              formData.append(`variation_image_${index}`, copy.image);
              delete copy.image;
            }
            return copy;
          });
          formData.append("variants", JSON.stringify(processedVars));
        }

        Object.entries(generalData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        formData.append("attributes", JSON.stringify(formattedAttributes));
        formData.append(
          "variantOptions",
          JSON.stringify(formattedVariantOptions)
        );

        setLoading(true);
        res = await axios.patch(
          `${BACKEND_URL}/api/products/${product._id}`,
          formData,
          { withCredentials: true }
        );
        setLoading(false);
        toast.success(res.data?.message || "Product Updated");
        router.replace("/admin/products");
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (key === "category" || key === "brand") {
            formData.append(key, value._id);
          } else if (key === "variants") {
            const processedVars = value.map((v, index) => {
              const copy = { ...v };
              if (copy.image && copy.image instanceof File) {
                formData.append(`variation_image_${index}`, copy.image);
                delete copy.image;
              }
              return copy;
            });
            formData.append(key, JSON.stringify(processedVars));
          } else if (key === "variantOptions") {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else formData.append(key, String(value).trim());
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
      toast.error("Failed to submit product details");
    }
  };

  return {
    refetch: fetchProducts,
    data: { generalData, handleInput },
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
    // WooCommerce-style variable product
    allAvailableVariants,
    activeAttributes,
    setActiveAttributes,
    handleAddAttribute,
    handleRemoveAttribute,
    handleToggleAttributeValue,
    handleToggleUsedForVariations,
    handleGenerateVariations,
    handleCategory,
    products,
    vehicle_utility_object: {},
    getChildCategories,
    handleSubmit,
    loading,
    errors,
    variations,
    setVariations,
    searchQuery,
    setSearchQuery,
    selectedProducts,
    setSelectedProducts,
    deleteProduct,
    bulkDeleteProducts,
  };
};

export default useProducts;
