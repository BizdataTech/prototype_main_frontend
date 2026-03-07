"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/cartContext";
import Link from "next/link";

const OrderSummary = () => {
  const router = useRouter();
  const orderSuccessful = true;
  const address = {
    firstName: "John",
    lastName: "Philip",
    address: "St Mardianl Local Villa Street, 4509 Upstreet Road, Washinglon",
    city: "Palmaria",
    state: "Selesca",
    phone: "919087887898",
  };

  //   just for now - cart data is taken from cart doc and not from order doc
  const { cart } = useContext(CartContext);
  return (
    <div className="w-[95%] mx-auto pt-[12rem] mb-4 space-y-6 text-neutral-800">
      {orderSuccessful ? (
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 bg-green-200 p-8 rounded-[.5rem]">
          <h2 className="capitalize text-[2.2rem] lg:text-[3rem] font-semibold">
            order successfully placed
          </h2>
          <Link
            href="/"
            className="capitalize text-[1.5rem] font-semibold underline cursor-pointer"
          >
            take me to home page, let's shop again
          </Link>
        </div>
      ) : (
        <h2>order failed</h2>
      )}

      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="bg-white p-6 border rounded-[.5rem] border-neutral-300 space-y-4">
          <h3 className="head text-[1.7rem] font-medium">Address</h3>
          <div className="details text-[1.7rem] leading-[2.4rem]">
            <p className="font-medium">
              {address.firstName} {address.lastName}
            </p>
            <p>{address.address}</p>
            <p>
              {address.city}, {address.state}
            </p>
            <p className="text-neutral-500">phone: {address.phone}</p>
          </div>
        </div>

        {/* Payment Method & Total */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          <div className="bg-white border border-neutral-300 rounded-[.5rem] p-6 text-[1.7rem]">
            <h2 className="font-semibold">Payment Method</h2>
            <p className="">Bank Transfer</p>
          </div>

          <div className="bg-[#b00015] text-white p-6 rounded-[.5rem] w-full lg:w-2/12">
            <p className="text-[1.5rem] flex flex-col text-end">
              Payment Total:
              <span className="font-semibold text-[2rem]">
                Rs {cart?.cartTotal}
              </span>
            </p>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="bg-white p-6 border border-neutral-300 rounded-[.5rem] space-y-4">
          <h2 className="text-[1.7rem] font-semibold">Items Ordered</h2>

          <div className="space-y-4">
            {cart &&
              cart?.items.map((item) => (
                <div
                  key={item._id}
                  className="py-5 px-2 border-b border-neutral-300 last:border-0 flex justify-between items-center gap-4"
                >
                  <div className="w-5/6">
                    <p className="font-medium text-[1.6rem]">
                      {item.productId.parentId.product_title} - {item.quantity}x
                    </p>
                    <p className="text-[1.5rem]">
                      Subtotal: Rs {item.productId.price * item.quantity}
                    </p>
                  </div>
                  <div>
                    <div className="image">
                      <img
                        src={item.productId.images[0]}
                        alt="product image"
                        className="w-[7rem] h-[7rem] object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
