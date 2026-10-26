import axios from "axios";
import { useEffect, useState } from "react";

const useAttributeCollection = () => {
  const [attributeCollections, setAttributeCollections] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    getAttributeCollections();
  }, []);

  return { attributeCollections, refetch: getAttributeCollections };
};

export default useAttributeCollection;
