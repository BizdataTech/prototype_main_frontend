"use client";

import { useEffect, useState } from "react";

const useBrand = () => {
  let [brands, setBrands] = useState([]);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // get all brands
  useEffect(() => {
    getBrands();
  }, []);

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

  return { brands, refetch: getBrands };
};

export default useBrand;
