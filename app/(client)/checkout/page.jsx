"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/cartContext";
import { toast } from "sonner";

const Checkout = () => {
  const router = useRouter();
  const { cart, clearCart } = useContext(CartContext);
  let address = {
    firstName: "John",
    lastName: "Philip",
    address: "St Mardianl Local Villa Street, 4509 Upstreet Road, Washinglon",
    city: "Palmaria",
    state: "Selesca",
    phone: "919087887898",
  };

  const handlePayment = async () => {
    let result = await clearCart();
    if (result) router.push("/summary");
    else toast.error("Payment Failed : Something Went Wrong!");
  };

  return (
    <div className="w-[95%] mx-auto pt-[12rem] pb-4 gap-10 text-neutral-800">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-9/12 space-y-4">
          {/* Products */}
          <div className="items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cart &&
              cart?.items.map((item) => (
                <div
                  key={item._id}
                  className="border border-neutral-300 p-6 rounded-[.5rem] bg-white flex gap-8"
                >
                  <div className="left min-w-0 font-medium space-y-4">
                    <p className="truncate text-[1.5rem] text-neutral-600">
                      {item.productId.parentId.product_title}
                    </p>
                    <p className="text-[1.8rem]">Rs {item.productId.price}</p>
                  </div>
                  <div className="right">
                    <div className="image w-[7rem]">
                      <img
                        src={item.productId.images[0]}
                        alt="product image"
                        className="w-[8rem] h-[8rem] object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Address */}
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

          {/* Bank Details */}
          <div className="bg-white border border-neutral-300 p-6 rounded-[.5rem] space-y-4">
            <h3 className="font-medium text-[1.7rem]">Bank Account Details:</h3>
            <div className="details leading-[2.5rem] text-[1.7rem]">
              <p className="text-neutral-600">
                Bank Name:{" "}
                <span className="font-medium text-neutral-900">
                  National Bank
                </span>
              </p>
              <p className="text-neutral-600">
                Account Holder:{" "}
                <span className="font-medium text-neutral-900">John Doe</span>
              </p>
              <p className="text-neutral-600">
                Account Number:{" "}
                <span className="font-medium text-neutral-900">9876543210</span>
              </p>
              <p className="text-neutral-600">
                IFSC Code:{" "}
                <span className="font-medium text-neutral-900">
                  NBIN0001234
                </span>
              </p>
              <p className="text-neutral-600">
                Branch:{" "}
                <span className="font-medium text-neutral-900">
                  Dubai Main Branch
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex flex-col gap-4 w-full lg:w-3/12 bg-white p-6 border border-gray-300 self-start">
          <h3 className="capitalize text-[1.5rem] font-medium">
            payment total
          </h3>
          <div className="flex flex-col text-[1.7rem]">
            <div className="flex justify-between">
              <p className="capitalize">product total</p>
              <p className="">{cart?.cartTotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="capitalize">discount</p>
              <p className="font-medium">0</p>
            </div>
            <div className="flex justify-between py-4 mt-4 border-t border-neutral-400">
              <p className="capitalize">total</p>
              <p className="font-medium">{cart?.cartTotal}</p>
            </div>
            <button
              onClick={handlePayment}
              className="bg-black mt-16 text-white text-[1.7rem] font-medium py-[.85rem] rounded-[.3rem] cursor-pointer "
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
