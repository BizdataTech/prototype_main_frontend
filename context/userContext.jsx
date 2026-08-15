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

  const updateProfile = async (name) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUser(data.user);
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("Password updated successfully!");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to update password");
      return false;
    }
  };

  const deactivateAccount = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/deactivate`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUser(null);
      toast.success("Account deactivated successfully");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to deactivate account");
      return false;
    }
  };

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) {
        setAddresses([]);
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/addresses`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setAddresses(data.addresses || []);
        }
      } catch (error) {
        console.error("Fetch addresses error:", error.message);
      }
    };
    fetchAddresses();
  }, [user]);

  const addAddress = async (address) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(address),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAddresses(data.addresses || []);
      toast.success("Address added successfully!");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to add address");
      return false;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAddresses(data.addresses || []);
      toast.success("Address deleted successfully!");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
      return false;
    }
  };

  const value = {
    user,
    loginUser,
    registerUser,
    logoutUser,
    updateProfile,
    changePassword,
    deactivateAccount,
    addresses,
    addAddress,
    deleteAddress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
