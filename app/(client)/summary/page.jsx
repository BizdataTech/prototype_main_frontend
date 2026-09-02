"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, Package, Truck, HouseLine } from "phosphor-react";
import { useSearchParams } from "next/navigation";

const STAGES = [
  { label: 'Order Placed', icon: Package },
  { label: 'Confirmed', icon: Package },
  { label: 'Shipped', icon: Truck },
  { label: 'Out for Delivery', icon: Truck },
  { label: 'Delivered', icon: HouseLine }
];

const OrderSummaryContent = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchOrder = async () => {
      const savedOrderId = searchParams.get("orderId") || localStorage.getItem("lastOrderId");
      if (!savedOrderId) {
        setLoading(false);
        return;
      }
      
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/orders/${savedOrderId}`, {
          method: "GET",
          credentials: "include"
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
          setOrder(result.order);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return <div className="w-full min-h-[60vh] flex items-center justify-center text-[2rem] font-light uppercase tracking-widest text-black">Loading Order Summary...</div>;
  }

  if (!order) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-[15rem] pb-24 text-center">
        <h2 className="text-[2.4rem] font-light text-black uppercase tracking-widest mb-6">No recent orders found</h2>
        <Link href="/" className="bg-black text-white px-12 py-5 text-[1.4rem] uppercase tracking-widest transition-all hover:bg-neutral-800">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';
  
  const getStatusIndex = (status) => {
    if (status === 'Confirmed' || status === 'Processing') return 1;
    const idx = STAGES.findIndex(s => s.label === status);
    return idx === -1 ? 0 : idx;
  };
  
  const currentStageIndex = getStatusIndex(order.orderStatus);

  const bannerInfo = () => {
    if (isCancelled) {
      return { 
        title: 'Order Cancelled', 
        icon: <X size={32} weight="light" className="text-red-600" />, 
        text: 'This order has been cancelled. If you have any questions, please contact support.', 
        colorClass: 'border-red-600 text-red-600',
        bgClass: 'bg-red-50'
      };
    }
    if (order.orderStatus === 'Delivered') {
      return { 
        title: 'Order Delivered', 
        icon: <Check size={32} weight="light" className="text-green-600" />, 
        text: 'Your order has been successfully delivered. We hope you enjoy your purchase.', 
        colorClass: 'border-green-600 text-green-600',
        bgClass: 'bg-green-50'
      };
    }
    return { 
      title: 'Order Confirmed', 
      icon: <Check size={32} weight="light" className="text-black" />, 
      text: 'Thank you for your purchase. We have received your order and will contact you regarding delivery.', 
      colorClass: 'border-black text-black',
      bgClass: 'bg-white'
    };
  };

  const banner = bannerInfo();

  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[900px] mx-auto flex flex-col gap-12">
        
        {/* Success Banner */}
        <div className={`flex flex-col items-center text-center py-12 border border-neutral-200 ${banner.bgClass}`}>
          <div className={`w-20 h-20 rounded-full border flex items-center justify-center mb-8 ${banner.colorClass}`}>
            {banner.icon}
          </div>
          <h1 className="text-[3.2rem] font-light text-black uppercase tracking-widest mb-4">
            {banner.title}
          </h1>
          <p className="text-[1.5rem] text-neutral-500 max-w-[45rem] leading-relaxed mb-8">
            {banner.text}
          </p>
          <Link
            href="/"
            className="bg-black hover:bg-neutral-800 text-white text-[1.3rem] uppercase tracking-widest px-12 py-5 transition-colors flex items-center gap-4"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>

        {/* Tracking Timeline */}
        <div className="flex flex-col gap-8 pt-8">
          <h3 className="text-[1.4rem] font-medium uppercase tracking-widest text-black border-b border-black pb-4">Order Tracking</h3>
          
          <div className="relative flex flex-col sm:flex-row justify-between pt-6 pb-12 overflow-x-auto gap-8 sm:gap-0">
            {!isCancelled ? STAGES.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const Icon = stage.icon;
              
              return (
                <div key={stage.label} className="flex flex-col items-center relative z-10 sm:w-1/5 min-w-[12rem]">
                  {/* Connector Line (Desktop) */}
                  {index !== 0 && (
                    <div className={`hidden sm:block absolute top-[2rem] right-[50%] w-full h-[2px] -z-10 ${isCompleted ? 'bg-black' : 'bg-neutral-200'}`} />
                  )}
                  {/* Connector Line (Mobile) */}
                  {index !== STAGES.length - 1 && (
                    <div className={`sm:hidden absolute top-[4rem] left-[50%] w-[2px] h-full -z-10 ${isCompleted ? 'bg-black' : 'bg-neutral-200'}`} />
                  )}
                  
                  <div className={`w-[4rem] h-[4rem] rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300 ${isCompleted ? 'border-black text-black' : 'border-neutral-300 text-neutral-300'} ${isCurrent ? 'ring-4 ring-neutral-100' : ''}`}>
                    {isCompleted ? <Check weight="bold" /> : <Icon weight="light" />}
                  </div>
                  
                  <p className={`mt-4 text-[1.3rem] uppercase tracking-widest text-center ${isCompleted ? 'text-black font-medium' : 'text-neutral-400 font-light'}`}>
                    {stage.label}
                  </p>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="w-[4rem] h-[4rem] rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center bg-white">
                  <X weight="bold" />
                </div>
                <p className="mt-4 text-[1.3rem] uppercase tracking-widest text-red-500 font-medium text-center">
                  Order Cancelled
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
          
          {/* Shipping Address */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[1.4rem] font-medium uppercase tracking-widest text-black border-b border-black pb-4">Shipping Information</h3>
            {order.shippingAddress ? (
              <div className="text-[1.5rem] leading-relaxed font-light text-black">
                <p className="font-medium text-[1.8rem] mb-4 uppercase tracking-widest">
                  {order.shippingAddress.name || order.shippingAddress.firstName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.locality && `${order.shippingAddress.locality}, `}{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.pincode || order.shippingAddress.postalCode}</p>
                <p className="mt-4 text-neutral-500">{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-[1.5rem] text-neutral-500 font-light">No address details available.</p>
            )}
          </div>

          {/* Payment & Amount */}
          <div className="flex flex-col gap-6">
            <h3 className="text-[1.4rem] font-medium uppercase tracking-widest text-black border-b border-black pb-4">Order Summary</h3>
            <div className="text-[1.5rem] text-black font-light flex flex-col gap-4 mt-2">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                <span className="text-neutral-500 uppercase tracking-widest">Order ID</span>
                <span className="font-medium text-black truncate max-w-[15rem]">{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                <span className="text-neutral-500 uppercase tracking-widest">Payment Method</span>
                <span>{order.paymentMethod || "Cash on Delivery"}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                <span className="text-neutral-500 uppercase tracking-widest">Payment Status</span>
                <span>{order.paymentStatus || "Pending"}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-black uppercase tracking-widest font-medium">Total Amount</span>
                <span className="font-medium text-[2rem]">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="flex flex-col gap-6 pt-12 border-t border-neutral-200">
          <h3 className="text-[1.4rem] font-medium uppercase tracking-widest text-black mb-4">Order Details</h3>
          
          <div className="flex flex-col gap-8">
            {order.items
              .filter((item) => item.productId)
              .map((item) => {
                const prod = item.productId;
                const title = prod.product_title || prod.parentId?.product_title || "Unknown Product";
                const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                
                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-8 pb-8 border-b border-neutral-100 last:border-0 last:pb-0"
                  >
                    <Link href={`/product/${prod._id}`} className="w-[10rem] h-[12rem] bg-neutral-50 p-2 shrink-0 flex items-center justify-center cursor-pointer border border-transparent hover:border-black transition-colors">
                      {image ? <img src={image} alt={title} className="max-w-full max-h-full object-contain mix-blend-multiply" /> : <span className="text-[1rem] text-neutral-400 uppercase tracking-widest">No Image</span>}
                    </Link>
                    <div className="flex flex-col flex-1">
                      <Link href={`/product/${prod._id}`} className="font-light text-[1.8rem] text-black line-clamp-2 leading-relaxed hover:underline cursor-pointer">
                        {title}
                      </Link>
                      <p className="text-[1.3rem] text-neutral-500 mt-2 uppercase tracking-widest">
                        Quantity: {item.quantity}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={`/product/${prod._id}`}
                          className="inline-block bg-black hover:bg-neutral-800 text-white text-[1.1rem] uppercase tracking-widest px-6 py-3 transition-colors text-center"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                    <div className="text-[2rem] font-light text-black whitespace-nowrap self-end sm:self-center">
                      ₹{Number(item.price || 0) * item.quantity}
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = () => {
  return (
    <Suspense fallback={<div className="w-full min-h-[60vh] flex items-center justify-center text-[2rem] font-light uppercase tracking-widest text-black">Loading Order Summary...</div>}>
      <OrderSummaryContent />
    </Suspense>
  );
};

export default OrderSummary;
