import axios from "axios";
import { useEffect, useState } from "react";

const useCollection = (id) => {
  let [data, setData] = useState(null);

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCollectionData = async () => {
    try {
      let res = await axios(`${NEXT_PUBLIC_BACKEND_URL}/api/attribute-collections/${id}`, {
        withCredentials: true,
      });
      setData(res.data.data);
      console.log("attribute collection :", res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getCollectionData();
  }, []);

  return { data, refetch: getCollectionData };
};

export default useCollection;
