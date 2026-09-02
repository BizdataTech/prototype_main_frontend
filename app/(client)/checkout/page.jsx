"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/cartContext";
import { UserContext } from "@/context/userContext";
import { toast } from "sonner";
import Link from "next/link";
import { Check, ArrowRight, ArrowLeft } from "phosphor-react";

const StepHeader = ({ step, title, isActive, isCompleted, onEdit, children }) => (
  <div className={`flex flex-col mb-8 ${isActive ? '' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
    <div className={`flex items-center gap-6 pb-6 border-b ${isActive ? 'border-black' : 'border-neutral-200'}`}>
      <div className={`w-8 h-8 flex items-center justify-center text-[1.2rem] font-medium border ${isActive || isCompleted ? 'border-black bg-black text-white' : 'border-neutral-300 text-neutral-500'}`}>
        {isCompleted ? <Check size={16} weight="bold" /> : step}
      </div>
      <h3 className={`text-[1.8rem] font-light uppercase tracking-widest ${isActive || isCompleted ? 'text-black' : 'text-neutral-500'}`}>
        {title}
      </h3>
      {isCompleted && !isActive && (
        <button onClick={onEdit} className="ml-auto text-[1.2rem] text-neutral-500 hover:text-black uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-black">
          Edit
        </button>
      )}
    </div>
    {isActive && (
      <div className="pt-10 pb-8 animate-fade-in">
        {children}
      </div>
    )}
  </div>
);

const Checkout = () => {
  const router = useRouter();
  const { cart, clearCart } = useContext(CartContext);
  const { user, addresses, addAddress } = useContext(UserContext);

  const [activeStep, setActiveStep] = useState(user ? 2 : 1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Address Form State for Editing/Adding if missing
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", pincode: "", locality: "", address: "", city: "", state: "", landmark: "", alternatePhone: "", addressType: "Home"
  });

  useEffect(() => {
    if (user && activeStep === 1) setActiveStep(2);
    if (!user) setActiveStep(1);
  }, [user, activeStep]);

  // Set default address if available
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
      setAddressForm(defaultAddr);
    }
  }, [addresses]);

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please provide a delivery address");
      return;
    }
    
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      const orderItems = cart.items.map(item => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
        price: item.productId.price || 0
      }));

      const tax = cart?.cartTotal ? Math.round(cart.cartTotal * 0.05) : 0;
      const shipping = cart?.cartTotal ? (cart.cartTotal > 1000 ? 0 : 50) : 0;
      const totalAmount = (cart?.cartTotal || 0) + tax + shipping;

      const orderPayload = {
        userId: user._id,
        items: orderItems,
        shippingAddress: selectedAddress,
        totalAmount,
        paymentMethod: "Cash on Delivery"
      };

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save snapshot for fallback, though we will use order details
        localStorage.setItem("lastOrderId", result.order._id);
        
        // Cart clear is handled by backend order controller, but we can call context clear to update UI
        await clearCart();
        toast.success("Order Confirmed!");
        router.push("/summary");
      } else {
        toast.error(result.message || "Payment Failed : Something Went Wrong!");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("An error occurred while creating your order.");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const success = await addAddress(addressForm);
    if (success) {
      setIsEditingAddress(false);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-[15rem] pb-24 text-center">
        <h2 className="text-[2.4rem] font-light text-black uppercase tracking-widest mb-6">Your cart is empty</h2>
        <Link href="/" className="bg-black text-white px-12 py-5 text-[1.4rem] uppercase tracking-widest transition-all hover:bg-neutral-800">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const tax = cart?.cartTotal ? Math.round(cart.cartTotal * 0.05) : 0;
  const shipping = cart?.cartTotal ? (cart.cartTotal > 1000 ? 0 : 50) : 0;
  const estimatedTotal = cart?.cartTotal ? cart.cartTotal + tax + shipping : 0;

  return (
    <div className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[1400px] mx-auto">
        <Link href="/cart" className="inline-flex items-center gap-3 text-[1.3rem] text-neutral-500 hover:text-black uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={16} /> Return to Cart
        </Link>
        
        <h1 className="text-[3rem] font-light text-black uppercase tracking-widest mb-16 border-b border-black pb-8">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Accordion Steps */}
          <div className="w-full lg:w-7/12 xl:w-8/12 flex flex-col">
            
            {/* STEP 1: LOGIN */}
            <StepHeader step={1} onEdit={() => setActiveStep(1)} title="Identification" isActive={activeStep === 1} isCompleted={user !== null}>
              {user ? (
                <div className="flex flex-col gap-6 text-[1.6rem] font-light text-black">
                  <div>
                    <span className="block text-[1.2rem] text-neutral-500 uppercase tracking-widest mb-2">Logged in as</span>
                    {user.username} <span className="text-neutral-500 ml-4">{user.email}</span>
                  </div>
                  <button onClick={() => setActiveStep(2)} className="w-fit bg-black text-white uppercase tracking-widest text-[1.3rem] px-12 py-5 hover:bg-neutral-800 transition-colors mt-4">
                    Continue
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <p className="text-[1.5rem] font-light text-neutral-600 max-w-[40rem] leading-relaxed">
                    Please log in or create an account to proceed securely with your checkout.
                  </p>
                  <Link href="/register/sign-in" className="w-fit bg-black text-white text-[1.3rem] uppercase tracking-widest px-12 py-5 hover:bg-neutral-800 transition-colors">
                    Login / Register
                  </Link>
                </div>
              )}
            </StepHeader>

            {/* STEP 2: DELIVERY ADDRESS */}
            <StepHeader step={2} onEdit={() => setActiveStep(2)} title="Shipping Address" isActive={activeStep === 2} isCompleted={activeStep > 2}>
              {!isEditingAddress ? (
                <div className="flex flex-col gap-8">
                  {addresses && addresses.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      <h4 className="text-[1.4rem] text-black uppercase tracking-widest">Select Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                          <div 
                            key={addr._id} 
                            onClick={() => { setSelectedAddress(addr); setAddressForm(addr); }}
                            className={`p-6 border cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400 bg-white'}`}
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAddress?._id === addr._id ? 'border-black' : 'border-neutral-300'}`}>
                                {selectedAddress?._id === addr._id && <div className="w-3 h-3 rounded-full bg-black"></div>}
                              </div>
                              <span className="text-[1.1rem] bg-black text-white px-3 py-1 uppercase tracking-widest">{addr.addressType || 'Home'}</span>
                            </div>
                            <div className="text-[1.4rem] font-light text-black">
                              <p className="font-medium text-[1.6rem]">{addr.name}</p>
                              <p className="text-neutral-500">{addr.phone}</p>
                              <p className="line-clamp-2 mt-2">{addr.address}</p>
                              <p>{addr.locality && `${addr.locality}, `}{addr.city}, {addr.state}</p>
                              <p>{addr.pincode}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border border-neutral-200 bg-neutral-50 text-[1.4rem] text-neutral-500 text-center uppercase">
                      No addresses found.
                    </div>
                  )}

                  <div className="flex gap-8 mt-2">
                    <button onClick={() => { setAddressForm({name: "", phone: "", pincode: "", locality: "", address: "", city: "", state: "", landmark: "", alternatePhone: "", addressType: "Home"}); setIsEditingAddress(true); }} className="text-[1.3rem] text-black uppercase tracking-widest border-b border-black pb-1 hover:text-neutral-600 transition-colors">+ Add New Address</button>
                    {selectedAddress && (
                      <button onClick={() => { setAddressForm(selectedAddress); setIsEditingAddress(true); }} className="text-[1.3rem] text-neutral-500 uppercase tracking-widest border-b border-neutral-300 hover:border-black pb-1 transition-colors">Edit Selected</button>
                    )}
                  </div>
                  <button onClick={() => { if(selectedAddress) setActiveStep(3); }} className={`w-fit text-[1.3rem] uppercase tracking-widest px-12 py-5 transition-colors mt-4 ${selectedAddress ? 'bg-black text-white hover:bg-neutral-800' : 'bg-neutral-200 text-neutral-500'}`}>Deliver here</button>
                </div>
              ) : (
                <div className="bg-white">
                  <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[1.4rem]">
                    <div className="flex flex-col gap-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Full Name</label>
                      <input required value={addressForm.name || ""} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Mobile Number</label>
                      <input required value={addressForm.phone || ""} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Pincode</label>
                      <input required value={addressForm.pincode || ""} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Locality</label>
                      <input required value={addressForm.locality || ""} onChange={e => setAddressForm({...addressForm, locality: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Address (Area and Street)</label>
                      <textarea required value={addressForm.address || ""} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors h-[12rem] resize-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">City/District/Town</label>
                      <input required value={addressForm.city || ""} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">State</label>
                      <input required value={addressForm.state || ""} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="p-4 border border-neutral-300 bg-neutral-50 focus:bg-white outline-none focus:border-black transition-colors" />
                    </div>
                    
                    <div className="flex flex-col gap-4 mt-2 md:col-span-2">
                      <span className="text-[1.2rem] text-neutral-500 uppercase tracking-widest">Address Type</span>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer text-[1.4rem] uppercase tracking-widest">
                          <input type="radio" name="addressType" checked={addressForm.addressType === 'Home'} onChange={() => setAddressForm({...addressForm, addressType: 'Home'})} className="w-5 h-5 accent-black" /> 
                          Home
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer text-[1.4rem] uppercase tracking-widest">
                          <input type="radio" name="addressType" checked={addressForm.addressType === 'Work'} onChange={() => setAddressForm({...addressForm, addressType: 'Work'})} className="w-5 h-5 accent-black" /> 
                          Work
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 mt-8 md:col-span-2 pt-8 border-t border-neutral-200">
                      <button type="submit" className="bg-black text-white text-[1.3rem] uppercase tracking-widest px-12 py-5 hover:bg-neutral-800 transition-colors">
                        Save Address
                      </button>
                      {selectedAddress && (
                        <button type="button" onClick={() => setIsEditingAddress(false)} className="text-[1.3rem] text-neutral-500 hover:text-black uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-black">
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </StepHeader>

            {/* STEP 3: ORDER SUMMARY */}
            <StepHeader step={3} onEdit={() => setActiveStep(3)} title="Review Order" isActive={activeStep === 3} isCompleted={activeStep > 3}>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-8">
                  {cart.items.map((item, index) => {
                    const prod = item.productId;
                    if (!prod) return null;
                    const title = prod.product_title || prod.parentId?.product_title;
                    const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                    
                    return (
                      <div key={index} className="flex gap-8 pb-8 border-b border-neutral-100 last:border-0 last:pb-0">
                        <div className="w-[12rem] h-[15rem] shrink-0 p-4 bg-neutral-50 flex items-center justify-center">
                          {image ? <img src={image} alt={title} className="max-w-full max-h-full object-contain mix-blend-multiply" /> : <span className="text-[1rem] text-neutral-400 uppercase tracking-widest">No Image</span>}
                        </div>
                        <div className="flex flex-col justify-between py-2">
                          <div>
                            <h4 className="text-[1.8rem] font-light text-black line-clamp-2 leading-relaxed">{title}</h4>
                            <span className="text-[1.3rem] text-neutral-500 uppercase tracking-widest mt-2 block">Quantity: {item.quantity}</span>
                          </div>
                          <div className="text-[2rem] font-light text-black">
                            ₹{Number(prod.price || 0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setActiveStep(4)} className="w-fit bg-black text-white text-[1.3rem] uppercase tracking-widest px-12 py-5 hover:bg-neutral-800 transition-colors self-end mt-4">
                  Proceed to Payment
                </button>
              </div>
            </StepHeader>

            {/* STEP 4: PAYMENT OPTIONS */}
            <StepHeader step={4} onEdit={() => setActiveStep(4)} title="Payment" isActive={activeStep === 4} isCompleted={false}>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-6 p-8 border border-black bg-neutral-50 cursor-pointer">
                    <input type="radio" name="payment" className="w-5 h-5 accent-black" defaultChecked />
                    <span className="text-[1.6rem] font-light uppercase tracking-widest text-black">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-6 p-8 border border-neutral-200 opacity-50 cursor-not-allowed">
                    <input type="radio" name="payment" className="w-5 h-5 accent-black" disabled />
                    <span className="text-[1.6rem] font-light uppercase tracking-widest text-black">Credit Card (Coming Soon)</span>
                  </label>
                </div>
                
                <button onClick={handlePayment} className="w-full bg-black text-white text-[1.4rem] uppercase tracking-widest py-6 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-4">
                  Complete Order <ArrowRight size={20} />
                </button>
              </div>
            </StepHeader>

          </div>

          {/* Price Summary Sidebar */}
          <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col sticky top-[10rem]">
            <div className="bg-neutral-50 p-10 flex flex-col">
              <h3 className="text-[2rem] font-light text-black uppercase tracking-widest mb-10 border-b border-neutral-200 pb-6">Order Summary</h3>
              
              <div className="flex flex-col gap-6 text-[1.6rem] font-light text-black mb-8">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({cart?.items?.length || 0} items)</span>
                  <span>₹{cart?.cartTotal || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax (Estimated)</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[2.4rem] font-light text-black pt-8 border-t border-neutral-200 mb-8">
                <span className="uppercase tracking-widest text-[1.6rem] font-medium">Estimated Total</span>
                <span>₹{estimatedTotal}</span>
              </div>
              
              <div className="text-center text-[1.2rem] text-neutral-500 uppercase tracking-widest leading-relaxed">
                Secure checkout. Complimentary shipping and returns on all eligible orders.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
