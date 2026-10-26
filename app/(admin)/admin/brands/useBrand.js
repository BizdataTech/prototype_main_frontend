"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const useBrand = () => {
  let [brands, setBrands] = useState([]);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // get all brands
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let getBrands = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/brands`, {
        withCredentials: true,
      });
      console.log("brands:", res.data?.brands);
      setBrands(res.data?.brands);
    } catch (err) {
      console.log("error:", err.message);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { brands, refetch: getBrands };
};

export default useBrand;
