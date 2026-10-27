import axios from "axios";
import { useEffect, useState } from "react";

const useCollection = (id) => {
  let [data, setData] = useState(null);

  const BACKEND_URL = process.env.BACKEND_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCollectionData = async () => {
    try {
      let res = await axios(`${BACKEND_URL}/api/attribute-collections/${id}`, {
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
