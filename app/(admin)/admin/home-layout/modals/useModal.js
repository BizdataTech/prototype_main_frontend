import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useModal = () => {
  let [products, setProducts] = useState([]);
  let [category, setCategory] = useState(null);

  let NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getProducts = async () => {
    try {
      let res = await axios.get(
        `${NEXT_PUBLIC_BACKEND_URL}/api/products?filter=admin-products-category&category=${category._id}`,
        { withCredentials: true },
      );
      setProducts(res.data?.products);
      console.log("block categories:", res.data?.products);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!category) return;
    getProducts();
  }, [category]);

  return { products, setProducts, category, setCategory };
};

export default useModal;
