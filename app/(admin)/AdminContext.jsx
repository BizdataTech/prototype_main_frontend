"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    validateLogin();
  }, []);

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

  let value = { adminUser, setAdminUser };
  return <AdminContext value={value}>{children}</AdminContext>;
};

export { AdminContext, AdminProvider };
