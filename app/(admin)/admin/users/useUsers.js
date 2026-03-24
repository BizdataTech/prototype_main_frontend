import axios from "axios";
import { useEffect, useState } from "react";

const useUsers = () => {
  let [users, setUsers] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    try {
      let res = await axios.get(`${BACKEND_URL}/api/admin-users/clients`, {
        withCredentials: true,
      });
      setUsers(res.data?.result);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { users, refetch: getClients };
};

export default useUsers;
