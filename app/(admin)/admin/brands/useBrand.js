"use client";

import { useEffect, useRef, useState } from "react";

const useBrand = () => {
  let [brands, setBrands] = useState([]);
  let fileInputRef = useRef(null);
  let [file, setFile] = useState(null);
  let [previewURL, setPreviewURL] = useState(null);
  let [brandName, setBrandName] = useState("");
  let [errors, setErrors] = useState({});
  let [status, setStatus] = useState("idle");
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // get all brands
  useEffect(() => {
    let getBrands = async () => {
      try {
        let response = await fetch(`${BACKEND_URL}/api/brands`, {
          method: "GET",
        });
        let result = await response.json();
        if (!response.ok) throw new Error(result.message);
        console.log("brands:", result.brands);
        setBrands(result.brands);
      } catch (error) {
        console.log("error:", error.message);
      }
    };
    getBrands();
  }, []);

  const openSystemFiles = () => {
    fileInputRef.current.click();
  };

  const handleBrandName = (event) => {
    setBrandName(event.target.value);
    setErrors((prev) => {
      let { brand_name, ...rest } = prev;
      return rest;
    });
  };

  const handleFileChange = (event) => {
    let file = event.target.files[0];
    if (!file) {
      return null;
    }

    setFile(file);
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    setErrors((prev) => {
      let { brand_image, ...rest } = prev;
      return rest;
    });
  };

  const submitBrand = async () => {
    try {
      let error_object = {};
      if (!brandName.trim()) error_object.brand_name = "Brand Name Required";

      if (!previewURL) error_object.brand_image = "Image Required";
      if (Object.keys(error_object)) {
        setErrors((prev) => {
          let newError = { ...prev };
          Object.entries(error_object).forEach(([key, value]) => {
            newError[key] = value;
          });
          return newError;
        });
      }

      if (!Object.keys(error_object).length) {
        let formData = new FormData();
        formData.append("image", file);
        formData.append("brand_name", brandName);

        setStatus("loading");
        let response = await fetch(`${BACKEND_URL}/api/brands`, {
          method: "POST",
          body: formData,
        });
        setStatus("idle");
        let result = await response.json();
        if (!response.ok) throw new Error(result.message);
        console.log(result.message);
        setBrands((prev) => [...prev, result.brand]);
        setPreviewURL(null);
        setBrandName("");
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  return {
    status,
    brands,
    fileInputRef,
    openSystemFiles,
    handleFileChange,
    previewURL,
    brandName,
    handleBrandName,
    submitBrand,
    errors,
  };
};

export default useBrand;
