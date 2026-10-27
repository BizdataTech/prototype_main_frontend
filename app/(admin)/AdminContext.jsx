"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const BACKEND_URL = process.env.BACKEND_URL;

  const validateLogin = async () => {
    try {
      let res = await axios(`${BACKEND_URL}/api/admin-users/verify`, {
        withCredentials: true,
      });
      setAdminUser(res.data.user);
    } catch (error) {
      setAdminUser(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    validateLogin();
  }, []);

  let value = { adminUser, setAdminUser };
  return <AdminContext value={value}>{children}</AdminContext>;
};

export { AdminContext, AdminProvider };
