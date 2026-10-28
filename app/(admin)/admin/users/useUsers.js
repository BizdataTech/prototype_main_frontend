import axios from "axios";
import { useEffect, useState } from "react";

const useUsers = () => {
  let [users, setUsers] = useState(null);
  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getClients = async () => {
    try {
      let res = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/api/admin-users/clients`, {
        withCredentials: true,
      });
      setUsers(res.data?.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return { users, refetch: getClients };
};

export default useUsers;
