import axios from "axios";
import { useEffect, useState } from "react";

const useAttributeCollection = () => {
  const [attributeCollections, setAttributeCollections] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getAttributeCollections();
  }, []);

  const getAttributeCollections = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/attribute-collections`, {
        withCredentials: true,
      });
      console.log("attribute collections:", res.data.collections);
      setAttributeCollections(res.data.collections);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { attributeCollections };
};

export default useAttributeCollection;
