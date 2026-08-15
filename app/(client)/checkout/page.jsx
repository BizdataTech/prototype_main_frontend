"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/cartContext";
import { UserContext } from "@/context/userContext";
import { toast } from "sonner";
import Link from "next/link";
import { Check, MapPin, PencilSimple } from "phosphor-react";

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
    
    // Save snapshot for the summary page since the cart is about to be deleted
    localStorage.setItem("lastOrderCart", JSON.stringify(cart));
    localStorage.setItem("lastOrderAddress", JSON.stringify(selectedAddress));

    let result = await clearCart();
    if (result) {
      toast.success("Order Confirmed!");
      router.push("/summary");
    } else {
      toast.error("Payment Failed : Something Went Wrong!");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    // Assuming addAddress handles both creating and updating for now
    const success = await addAddress(addressForm);
    if (success) {
      setIsEditingAddress(false);
      // Let context re-fetch and set it
    }
  };

  const StepHeader = ({ step, title, isActive, isCompleted, children }) => (
    <div className={`flex flex-col ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className={`flex items-center gap-4 px-8 py-4 ${isActive ? 'bg-[#2874f0]' : 'bg-white border-b border-neutral-200'}`}>
        <div className={`w-[2.4rem] h-[2.4rem] flex items-center justify-center text-[1.4rem] font-medium rounded-[.2rem] ${isActive ? 'bg-white text-[#2874f0]' : 'bg-neutral-100 text-neutral-500'}`}>
          {isCompleted ? <Check className="w-5 h-5 text-[#2874f0]" weight="bold" /> : step}
        </div>
        <h3 className={`text-[1.8rem] font-medium uppercase ${isActive ? 'text-white' : 'text-neutral-500'}`}>
          {title}
        </h3>
        {isCompleted && !isActive && (
          <button onClick={() => setActiveStep(step)} className="ml-auto text-[1.4rem] text-[#2874f0] font-medium border border-neutral-200 px-6 py-2 rounded-[.2rem]">
            CHANGE
          </button>
        )}
      </div>
      {isActive && (
        <div className="p-8 border-x border-b border-neutral-200 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  if (!cart?.items?.length) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-[15rem]">
        <h2 className="text-[2rem] font-medium text-neutral-800">Your cart is empty!</h2>
        <Link href="/" className="mt-4 bg-[#2874f0] hover:bg-[#1f5cbf] text-white px-8 py-4 text-[1.5rem] rounded-[.2rem]">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-100 pt-[14rem] pb-16">
      <div className="w-[95%] max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Accordion Steps */}
        <div className="w-full lg:w-8/12 flex flex-col gap-6">
          
          {/* STEP 1: LOGIN */}
          <StepHeader step={1} title="Login" isActive={activeStep === 1} isCompleted={user !== null}>
            {user ? (
              <div className="flex gap-4 items-center text-[1.5rem]">
                <span className="font-medium">{user.username}</span>
                <span className="text-neutral-500">{user.email}</span>
                <button onClick={() => setActiveStep(2)} className="ml-auto bg-[#fb641b] text-white font-medium px-8 py-3 rounded-[.2rem]">
                  CONTINUE TO CHECKOUT
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-[1.5rem] text-neutral-600">Please login or sign up to proceed with checkout.</p>
                <Link href="/register/sign-in" className="w-fit bg-[#fb641b] hover:bg-[#f05a11] text-white text-[1.5rem] font-medium px-16 py-4 rounded-[.2rem] shadow-sm">
                  Login / Signup
                </Link>
              </div>
            )}
          </StepHeader>

          {/* STEP 2: DELIVERY ADDRESS */}
          <StepHeader step={2} title="Delivery Address" isActive={activeStep === 2} isCompleted={activeStep > 2}>
            {selectedAddress && !isEditingAddress ? (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 p-6 border border-[#2874f0] bg-blue-50/20 rounded-[.4rem]">
                  <input type="radio" checked readOnly className="mt-1 w-5 h-5 accent-[#2874f0]" />
                  <div className="flex flex-col gap-2 text-[1.4rem] w-full">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-black">{selectedAddress.name}</span>
                      <span className="bg-neutral-200 text-neutral-600 text-[1rem] px-2 py-0.5 rounded-[.2rem] uppercase">{selectedAddress.addressType || 'Home'}</span>
                      <span className="font-medium text-black">{selectedAddress.phone}</span>
                      <button onClick={() => setIsEditingAddress(true)} className="ml-auto flex items-center gap-2 text-[#2874f0] font-medium uppercase hover:underline">
                        <PencilSimple weight="bold" /> Edit
                      </button>
                    </div>
                    <p className="text-neutral-600 leading-relaxed max-w-2xl">
                      {selectedAddress.address}, {selectedAddress.locality ? selectedAddress.locality + ", " : ""}{selectedAddress.city}, {selectedAddress.state} - <span className="font-medium">{selectedAddress.pincode}</span>
                    </p>
                    <button onClick={() => setActiveStep(3)} className="mt-6 w-fit bg-[#fb641b] hover:bg-[#f05a11] text-white text-[1.5rem] font-medium px-12 py-4 rounded-[.2rem] uppercase shadow-sm">
                      Deliver Here
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50/30 p-8 rounded-[.4rem]">
                <h4 className="text-[1.6rem] font-medium text-[#2874f0] mb-6 flex items-center gap-2">
                  <MapPin weight="fill" /> {selectedAddress ? "EDIT ADDRESS" : "ADD DELIVERY ADDRESS"}
                </h4>
                <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[1.4rem]">
                  <input required placeholder="Name" value={addressForm.name || ""} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0]" />
                  <input required placeholder="10-digit mobile number" value={addressForm.phone || ""} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0]" />
                  <input required placeholder="Pincode" value={addressForm.pincode || ""} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0]" />
                  <input required placeholder="Locality" value={addressForm.locality || ""} onChange={e => setAddressForm({...addressForm, locality: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0]" />
                  <textarea required placeholder="Address (Area and Street)" value={addressForm.address || ""} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0] md:col-span-2 h-[10rem] resize-none" />
                  <input required placeholder="City/District/Town" value={addressForm.city || ""} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0]" />
                  <input required placeholder="State" value={addressForm.state || ""} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="p-4 border border-neutral-300 rounded-[.2rem] outline-none focus:border-[#2874f0]" />
                  <div className="flex items-center gap-6 mt-4 md:col-span-2">
                    <span className="text-neutral-500">Address Type</span>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="addressType" checked={addressForm.addressType === 'Home'} onChange={() => setAddressForm({...addressForm, addressType: 'Home'})} className="w-5 h-5 accent-[#2874f0]" /> Home</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="addressType" checked={addressForm.addressType === 'Work'} onChange={() => setAddressForm({...addressForm, addressType: 'Work'})} className="w-5 h-5 accent-[#2874f0]" /> Work</label>
                  </div>
                  <div className="flex gap-4 mt-6 md:col-span-2">
                    <button type="submit" className="bg-[#fb641b] hover:bg-[#f05a11] text-white text-[1.5rem] font-medium px-12 py-4 rounded-[.2rem] uppercase shadow-sm">Save and Deliver Here</button>
                    {selectedAddress && (
                      <button type="button" onClick={() => setIsEditingAddress(false)} className="text-[#2874f0] font-medium text-[1.5rem] px-8 hover:underline">Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </StepHeader>

          {/* STEP 3: ORDER SUMMARY */}
          <StepHeader step={3} title="Order Summary" isActive={activeStep === 3} isCompleted={activeStep > 3}>
            <div className="flex flex-col gap-6">
              {cart.items.map((item, index) => {
                const prod = item.productId;
                if (!prod) return null;
                const title = prod.product_title || prod.parentId?.product_title;
                const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                
                return (
                  <div key={index} className="flex gap-6 pb-6 border-b border-neutral-100 last:border-0">
                    <div className="w-[8rem] h-[8rem] shrink-0 p-2 bg-neutral-50 rounded-[.4rem]">
                      {image && <img src={image} alt={title} className="w-full h-full object-contain" />}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[1.6rem] font-medium text-black line-clamp-1">{title}</h4>
                      <span className="text-[1.4rem] text-neutral-500 mt-1">Qty: {item.quantity}</span>
                      <div className="flex items-baseline gap-3 mt-2">
                        <span className="text-[1.8rem] font-medium text-black">Rs {Number(prod.price || 0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => setActiveStep(4)} className="w-fit bg-[#fb641b] hover:bg-[#f05a11] text-white text-[1.5rem] font-medium px-12 py-4 rounded-[.2rem] uppercase shadow-sm self-end">
                Continue
              </button>
            </div>
          </StepHeader>

          {/* STEP 4: PAYMENT OPTIONS */}
          <StepHeader step={4} title="Payment Options" isActive={activeStep === 4} isCompleted={false}>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-4 p-4 border border-[#2874f0] bg-blue-50/10 rounded-[.4rem] cursor-pointer">
                <input type="radio" name="payment" className="w-5 h-5 accent-[#2874f0]" defaultChecked />
                <span className="text-[1.6rem] font-medium text-black">Cash on Delivery</span>
              </label>
              
              <button onClick={handlePayment} className="mt-6 w-full bg-[#fb641b] hover:bg-[#f05a11] text-white text-[1.6rem] font-medium px-12 py-4 rounded-[.2rem] uppercase shadow-sm">
                Confirm Order
              </button>
            </div>
          </StepHeader>

        </div>

        {/* Price Summary Sidebar */}
        <div className="w-full lg:w-4/12 flex flex-col gap-4 sticky top-[10rem]">
          <div className="bg-white rounded-[.4rem] shadow-sm">
            <div className="border-b border-neutral-200 px-8 py-6">
              <h3 className="text-[1.6rem] font-medium text-neutral-500 uppercase tracking-wide">Price Details</h3>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center text-[1.6rem] text-neutral-800">
                <span>Price ({cart?.items?.length || 0} items)</span>
                <span>Rs {cart?.cartTotal || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[1.6rem] text-neutral-800">
                <span>Delivery Charges</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center text-[2rem] font-medium text-black pt-6 border-t border-neutral-200 border-dashed">
                <span>Total Amount</span>
                <span>Rs {cart?.cartTotal || 0}</span>
              </div>
              <div className="text-[1.5rem] text-green-600 font-medium pt-2">
                You will save delivery charges on this order
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
