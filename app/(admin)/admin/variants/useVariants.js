import axios from "axios";
import { useEffect, useState } from "react";

const useVariants = () => {
  const [variants, setVariants] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getVariants();
  }, []);

  const getVariants = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/variants`, {
        withCredentials: true,
      });
      console.log("variants:", res.data.variants);
      setVariants(res.data.variants);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { variants, refetch: getVariants };
};

export default useVariants;
