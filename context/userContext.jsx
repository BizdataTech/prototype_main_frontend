"use client";

import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    let url = `${BACKEND_URL}/api/auth/verify/me`;
    const getUserStat = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        console.log("user:", result.user);
        setUser(result.user);
      } catch (error) {
        console.log(error.message);
        setUser(null);
      }
    };
    getUserStat();
  }, []);

  const loginUser = async (userData) => {
    console.log("user login data:", userData);
    try {
      let response = await fetch(`${BACKEND_URL}/api/auth/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      let data = await response.json();
      if (response.status === 401) {
        return { wrongCredentials: true };
      }
      if (!response.ok) throw new Error();
      console.log("data:", data);
      console.log("user:", data.user);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  };
  const registerUser = async (userData) => {
    console.log("user register data:", userData);
    try {
      let response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      let data = await response.json();
      if (response.status === 400) {
        return { existingUser: true };
      }
      if (!response.ok) throw new Error(data.message);
      console.log("data:", data);
      console.log("user:", data.user);
      setUser(data.user);
      return true;
    } catch (error) {
      toast.error("error:", error.message);
      console.error("error:", error);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast.success("User Successfully Logged Out");
    } catch (error) {
      console.error(error.message);
    }
  };

  const value = {
    user,
    loginUser,
    registerUser,
    logoutUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
