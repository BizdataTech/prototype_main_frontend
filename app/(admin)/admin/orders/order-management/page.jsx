"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "phosphor-react";

const OrderManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // Wait, there's no admin-specific getOrderById, but the normal one works if no auth guard.
      // Wait, let's use the normal route /api/orders/:id
      const res = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
      setOrderStatus(res.data.order.orderStatus);
      setPaymentStatus(res.data.order.paymentStatus);
    } catch (err) {
      toast.error("Failed to fetch order details");
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const res = await axios.put(
        `${BACKEND_URL}/api/admin/orders/${orderId}/status`,
        { orderStatus, paymentStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully!");
      setOrder(res.data.order);
    } catch (err) {
      toast.error("Failed to update order");
      console.log(err.response?.data?.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-[1.6rem] font-semibold text-center mt-10">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-[1.6rem] font-semibold text-center mt-10 text-red-600">Order not found.</div>;
  }

  return (
    <main className="w-full max-w-[800px] flex flex-col gap-8 pb-10">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-[1.4rem] font-medium text-neutral-600 hover:text-black transition"
      >
        <ArrowLeft size={20} weight="bold" /> Back to Orders
      </button>

      <div className="bg-white p-8 rounded shadow-sm border border-neutral-200">
        <h2 className="text-[1.8rem] font-semibold mb-6 border-b pb-4">Order Summary</h2>
        <div className="grid grid-cols-2 gap-y-4 text-[1.4rem]">
          <p><span className="font-medium text-neutral-500">Order ID:</span> {order._id}</p>
          <p><span className="font-medium text-neutral-500">Total Amount:</span> AED {order.totalAmount}</p>
          <p><span className="font-medium text-neutral-500">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><span className="font-medium text-neutral-500">Payment Method:</span> {order.paymentMethod}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded shadow-sm border border-neutral-200">
        <h2 className="text-[1.8rem] font-semibold mb-6 border-b pb-4">Customer & Shipping</h2>
        <div className="text-[1.4rem] flex flex-col gap-2">
          <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
          <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
          <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
          <p>Phone: {order.shippingAddress?.phone}</p>
          <p>Email: {order.shippingAddress?.email}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded shadow-sm border border-neutral-200">
        <h2 className="text-[1.8rem] font-semibold mb-6 border-b pb-4">Order Items</h2>
        <div className="flex flex-col gap-4">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-[1.4rem] border-b pb-2 last:border-0">
              <div className="flex items-center gap-4">
                <img src={item.productId?.images[0]} alt={item.productId?.title} className="w-[50px] h-[50px] object-cover rounded border" />
                <span>{item.productId?.title} x {item.quantity}</span>
              </div>
              <span className="font-medium">AED {item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded shadow-sm border border-neutral-200 flex flex-col gap-6">
        <h2 className="text-[1.8rem] font-semibold mb-2 border-b pb-4">Update Status</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[1.4rem] font-medium text-neutral-600">Payment Status</label>
            <select 
              className="a-input p-3 border rounded text-[1.4rem]" 
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[1.4rem] font-medium text-neutral-600">Order Status</label>
            <select 
              className="a-input p-3 border rounded text-[1.4rem]" 
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={updating}
          className="mt-4 bg-black text-white text-[1.4rem] font-medium py-3 px-6 rounded hover:bg-neutral-800 transition disabled:opacity-70 disabled:cursor-not-allowed w-fit"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </main>
  );
};

export default OrderManagement;
