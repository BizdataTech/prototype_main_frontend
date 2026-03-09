import { useEffect, useState } from "react";

const useUsers = () => {
  let [users, setUsers] = useState(null);
  useEffect(() => {
    setUsers([]);
  }, []);

  return { users };
};

export default useUsers;
