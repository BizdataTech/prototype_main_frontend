"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const useOrders = () => {
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getAllOrders = async (filters = {}) => {
    try {
      setOrders(null);
      let queryParams = new URLSearchParams();
      if (filters.status && filters.status !== 'All') queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      let res = await axios.get(`${BACKEND_URL}/api/admin/orders?${queryParams.toString()}`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.log(err.response?.data?.message);
      setOrders([]);
    }
  };

  const updateOrder = async (id, orderStatus, paymentStatus) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/orders/${id}/status`,
        { orderStatus, paymentStatus },
        { withCredentials: true }
      );
      toast.success("Order updated successfully!");
    } catch (err) {
      toast.error("Failed to update order");
      console.log(err.response?.data?.message);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/orders/${id}`, {
        withCredentials: true,
      });
      toast.success("Order deleted successfully!");
      return true;
    } catch (err) {
      toast.error("Failed to delete order");
      console.log(err.response?.data?.message);
      return false;
    }
  };

  const handlePage = (direction) => {
    if (direction === "up" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "down" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    orders,
    currentPage,
    totalPages,
    handlePage,
    getAllOrders,
    updateOrder,
    deleteOrder
  };
};

export default useOrders;
