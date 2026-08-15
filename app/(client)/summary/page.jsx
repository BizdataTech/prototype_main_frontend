"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "phosphor-react";

const OrderSummary = () => {
  const [orderCart, setOrderCart] = useState(null);
  const [orderAddress, setOrderAddress] = useState(null);

  useEffect(() => {
    // Read the snapshot saved right before the cart was cleared
    const savedCart = localStorage.getItem("lastOrderCart");
    const savedAddress = localStorage.getItem("lastOrderAddress");
    if (savedCart) setOrderCart(JSON.parse(savedCart));
    if (savedAddress) setOrderAddress(JSON.parse(savedAddress));
  }, []);

  if (!orderCart) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-[15rem]">
        <h2 className="text-[2rem] font-medium text-neutral-800">No recent orders found</h2>
        <Link href="/" className="mt-4 bg-[#2874f0] hover:bg-[#1f5cbf] text-white px-8 py-4 text-[1.5rem] rounded-[.2rem]">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-100 pt-[14rem] pb-16">
      <div className="w-[95%] max-w-5xl mx-auto flex flex-col gap-6 text-neutral-800">
        
        {/* Success Banner */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[.4rem] shadow-sm border-l-[6px] border-green-500">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-[4rem] h-[4rem] text-green-500" weight="fill" />
            <h2 className="text-[2.2rem] lg:text-[2.6rem] font-medium text-black">
              Order placed successfully!
            </h2>
          </div>
          <Link
            href="/"
            className="bg-[#2874f0] hover:bg-[#1f5cbf] text-white text-[1.5rem] font-medium px-8 py-3 rounded-[.2rem] uppercase shadow-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shipping Address */}
          <div className="bg-white p-8 rounded-[.4rem] shadow-sm flex flex-col gap-4">
            <h3 className="text-[1.8rem] font-medium uppercase text-neutral-500 border-b border-neutral-100 pb-4">Delivery Address</h3>
            {orderAddress ? (
              <div className="text-[1.5rem] leading-relaxed text-black mt-2">
                <p className="font-medium text-[1.6rem] mb-1">
                  {orderAddress.name} <span className="text-neutral-500 font-normal ml-2">{orderAddress.phone}</span>
                </p>
                <p>{orderAddress.address}</p>
                <p>{orderAddress.locality && `${orderAddress.locality}, `}{orderAddress.city}, {orderAddress.state} - <span className="font-medium">{orderAddress.pincode}</span></p>
              </div>
            ) : (
              <p className="text-[1.5rem] text-neutral-500">No address details available.</p>
            )}
          </div>

          {/* Payment & Amount */}
          <div className="bg-white p-8 rounded-[.4rem] shadow-sm flex flex-col gap-4">
            <h3 className="text-[1.8rem] font-medium uppercase text-neutral-500 border-b border-neutral-100 pb-4">Payment Summary</h3>
            <div className="text-[1.5rem] text-black mt-2 flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Method</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Total Amount</span>
                <span className="font-medium text-[1.8rem]">Rs {orderCart.cartTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="bg-white p-8 rounded-[.4rem] shadow-sm flex flex-col gap-4">
          <h3 className="text-[1.8rem] font-medium uppercase text-neutral-500 border-b border-neutral-100 pb-4">Items Ordered</h3>
          
          <div className="flex flex-col gap-6 mt-4">
            {orderCart.items
              .filter((item) => item.productId)
              .map((item) => {
                const prod = item.productId;
                const title = prod.product_title || prod.parentId?.product_title;
                const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                
                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center gap-6 pb-6 border-b border-neutral-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-[8rem] h-[8rem] bg-neutral-50 p-2 rounded-[.4rem] shrink-0">
                        {image && <img src={image} alt={title} className="w-full h-full object-contain" />}
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-medium text-[1.6rem] text-black line-clamp-1">
                          {title}
                        </p>
                        <p className="text-[1.4rem] text-neutral-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-[1.8rem] font-medium text-black whitespace-nowrap">
                        Rs {Number(prod.price || 0) * item.quantity}
                      </div>
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

export default OrderSummary;
