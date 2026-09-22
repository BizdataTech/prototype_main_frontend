"use client";

import { useContext, useState, useEffect, Suspense } from "react";
import { UserContext } from "@/context/userContext";
import { CartContext } from "@/context/cartContext";
import { WishlistContext } from "@/context/wishlistContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Key, 
  Heart, 
  ShoppingCart, 
  Gear, 
  SignOut,
  Spinner,
  House,
  Trash,
  Pencil,
  ArrowRight
} from "phosphor-react";

const ProfilePageContent = () => {
  const { user, logoutUser, updateProfile, changePassword, deactivateAccount, addresses, addAddress, deleteAddress } = useContext(UserContext);
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { items: wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected tab state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form states
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [newAddress, setNewAddress] = useState({ label: "", street: "", city: "", zip: "", country: "" });
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.username || "",
        email: user.email || ""
      });
      
      const fetchOrders = async () => {
        try {
          const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
          const response = await fetch(`${BACKEND_URL}/api/orders/user/${user._id || user.id}`, {
            method: "GET",
            credentials: "include"
          });
          const result = await response.json();
          if (response.ok && result.success) {
            setOrders(result.orders);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      
      fetchOrders();
    }
  }, [user]);

  // If user is loading or null
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner className="w-[4rem] h-[4rem] animate-spin text-black" />
      </div>
    );
  }

  if (user === null) {
    return (
      <section className="w-full min-h-[60vh] bg-white pt-[18rem] pb-24 text-center">
        <div className="flex flex-col items-center gap-8 w-[95%] max-w-[60rem] mx-auto">
          <User className="w-[8rem] h-[8rem] text-black stroke-[1]" />
          <h2 className="text-[2.4rem] font-light text-black tracking-widest uppercase">ACCESS DENIED</h2>
          <p className="text-[1.4rem] text-neutral-500 uppercase tracking-widest text-center">
            Please sign in to view your account details.
          </p>
          <Link href="/register/sign-in" className="mt-4 bg-black text-white text-[1.4rem] tracking-widest uppercase px-16 py-5 transition-all hover:bg-neutral-800">
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateProfile(profileData.name);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (success) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const success = await addAddress(newAddress);
    if (success) {
      setNewAddress({ name: "", phone: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "Home" });
      setShowAddressForm(false);
    }
  };

  const handleRemoveAddress = async (id) => {
    await deleteAddress(id);
  };

  const handleMoveToCart = async (productId) => {
    // Basic logic mapping since wishlist items can be moved to cart
    // Contexts exist for both so we use them
    // This function wasn't explicitly here before, but we need it for wishlist
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile Info" },
    { id: "orders", label: "Order History" },
    { id: "wishlist", label: "Wishlist", badge: wishlistItems.length },
    { id: "cart", label: "Shopping Cart", badge: cart?.items?.length },
    { id: "addresses", label: "Saved Addresses" },
    { id: "password", label: "Change Password" },
    { id: "settings", label: "Account Settings" }
  ];

  return (
    <main className="w-full min-h-screen bg-white pt-[14rem] pb-24">
      <div className="w-[95%] max-w-[1400px] mx-auto">
        <h1 className="text-[3rem] font-light text-black uppercase tracking-widest mb-16 border-b border-black pb-8">
          My Account
        </h1>

        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-3/12 xl:w-2/12 flex flex-col">
            <div className="mb-12 pb-8 border-b border-neutral-200">
              <span className="text-[1.1rem] text-neutral-500 uppercase tracking-widest block mb-2">Welcome</span>
              <h3 className="text-[1.8rem] font-light text-black uppercase tracking-widest truncate">{user.name || "Customer"}</h3>
            </div>
            
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      router.push(`/profile?tab=${item.id}`);
                    }}
                    className={`flex items-center justify-between text-[1.3rem] uppercase tracking-widest transition-colors ${
                      isActive
                        ? "text-black font-medium"
                        : "text-neutral-500 hover:text-black font-light"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[1.1rem] ${isActive ? 'text-black' : 'text-neutral-400'}`}>
                        ({item.badge})
                      </span>
                    )}
                  </button>
                );
              })}
              
              <button
                onClick={logoutUser}
                className="flex items-center justify-between text-[1.3rem] uppercase tracking-widest text-neutral-500 hover:text-black font-light mt-8 pt-8 border-t border-neutral-200 transition-colors"
              >
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Content Display Area */}
          <section className="w-full lg:w-9/12 xl:w-10/12 min-h-[50rem]">
            
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Account Dashboard</h2>
                <p className="text-[1.4rem] font-light text-neutral-600 leading-relaxed max-w-[70rem]">
                  From your account dashboard, you can view your recent orders, manage your shipping addresses, edit your profile details, and change your password.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                  <div onClick={() => setActiveTab("orders")} className="border border-neutral-200 p-10 hover:border-black transition-colors cursor-pointer flex flex-col items-start bg-neutral-50 hover:bg-white">
                    <ShoppingBag size={24} weight="light" className="text-black mb-6" />
                    <h4 className="text-[1.4rem] uppercase tracking-widest text-black mb-2">Orders</h4>
                    <p className="text-[1.3rem] font-light text-neutral-500">Track and review past orders.</p>
                  </div>
                  <div onClick={() => setActiveTab("wishlist")} className="border border-neutral-200 p-10 hover:border-black transition-colors cursor-pointer flex flex-col items-start bg-neutral-50 hover:bg-white">
                    <Heart size={24} weight="light" className="text-black mb-6" />
                    <h4 className="text-[1.4rem] uppercase tracking-widest text-black mb-2">Wishlist</h4>
                    <p className="text-[1.3rem] font-light text-neutral-500">{wishlistItems.length} items saved.</p>
                  </div>
                  <div onClick={() => setActiveTab("profile")} className="border border-neutral-200 p-10 hover:border-black transition-colors cursor-pointer flex flex-col items-start bg-neutral-50 hover:bg-white">
                    <User size={24} weight="light" className="text-black mb-6" />
                    <h4 className="text-[1.4rem] uppercase tracking-widest text-black mb-2">Personal Info</h4>
                    <p className="text-[1.3rem] font-light text-neutral-500">Update your details.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="flex flex-col gap-8 max-w-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="border-b border-neutral-300 py-3 text-[1.6rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="border-b border-neutral-300 py-3 text-[1.6rem] font-light text-neutral-400 cursor-not-allowed bg-transparent"
                    />
                    <span className="text-[1rem] text-neutral-400 uppercase tracking-widest mt-1">Email cannot be modified</span>
                  </div>
                  <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-[1.3rem] uppercase tracking-widest py-5 px-12 self-start mt-6 transition-all">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Order History</h2>
                {loadingOrders ? (
                  <div className="py-24 flex justify-center items-center text-[1.4rem] uppercase tracking-widest text-neutral-500">Loading orders...</div>
                ) : orders.length > 0 ? (
                  <div className="flex flex-col gap-12">
                    {orders.map((order) => (
                      <div 
                        key={order._id} 
                        onClick={() => router.push(`/summary?orderId=${order._id}`)}
                        className="border border-neutral-200 bg-neutral-50 p-8 flex flex-col gap-6 group hover:bg-white hover:border-black transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                          <div>
                            <span className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Order ID</span>
                            <p className="text-[1.3rem] font-medium text-black mt-1">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <div>
                            <span className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Date</span>
                            <p className="text-[1.3rem] font-medium text-black mt-1">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <span className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Total</span>
                            <p className="text-[1.3rem] font-medium text-black mt-1">AED {order.totalAmount}</p>
                          </div>
                          <div>
                            <span className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Status</span>
                            <p className="text-[1.3rem] font-medium text-black mt-1 uppercase bg-neutral-200 px-3 py-1 mt-1 inline-block text-[1rem]">
                              {order.orderStatus}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 mt-2">
                          {order.items.map((item) => {
                            const prod = item.productId;
                            if (!prod) return null;
                            const title = prod.product_title || prod.parentId?.product_title || "Unknown Product";
                            const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                            return (
                              <div key={item._id} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-neutral-100 pb-4 last:border-0">
                                  <div 
                                    onClick={() => {
                                      router.push(`/summary?orderId=${order._id}`);
                                    }} 
                                    className="flex gap-6 items-center flex-1 cursor-pointer group"
                                  >
                                    <div className="w-16 h-20 bg-white border border-neutral-200 p-2 shrink-0 flex items-center justify-center transition-colors group-hover:border-black">
                                      {image ? <img src={image} alt={title} className="max-w-full max-h-full object-contain mix-blend-multiply" /> : <span className="text-[0.8rem] text-neutral-400">N/A</span>}
                                    </div>
                                    <div>
                                      <h4 className="text-[1.4rem] font-light text-black line-clamp-1 group-hover:underline">{title}</h4>
                                      <span className="text-[1.2rem] text-neutral-500 block mt-1">Qty: {item.quantity}</span>
                                      <div className="text-[1.4rem] text-black mt-1">
                                        AED {Number(item.price || 0) * item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-4 self-end sm:self-auto w-full sm:w-auto">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/summary?orderId=${order._id}`);
                                      }}
                                      className="flex-1 sm:flex-none border border-black hover:bg-black hover:text-white text-black text-[1.1rem] uppercase tracking-widest px-6 py-3 transition-colors text-center"
                                    >
                                      View Summary
                                    </button>
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/product/${prod._id}`);
                                    }}
                                    className="flex-1 sm:flex-none bg-black hover:bg-neutral-800 text-white text-[1.1rem] uppercase tracking-widest px-6 py-3 transition-colors text-center cursor-pointer"
                                  >
                                    View Product
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 flex flex-col items-start gap-6 border border-neutral-200 bg-neutral-50 p-12">
                    <h4 className="text-[1.8rem] font-light text-black uppercase tracking-widest">No Orders Found</h4>
                    <p className="text-[1.4rem] font-light text-neutral-500 max-w-lg leading-relaxed">
                      You haven't placed any orders yet. Once you place an order, it will appear here.
                    </p>
                    <Link href="/" className="mt-4 bg-black hover:bg-neutral-800 text-white text-[1.2rem] uppercase tracking-widest px-10 py-4 transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {wishlistItems.map((item) => {
                      const prod = item.productId;
                      if (!prod) return null;
                      const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                      return (
                        <div key={item._id || prod._id} className="flex gap-6 pb-8 border-b border-neutral-200 group">
                          <Link href={`/product/${prod._id}`} className="w-[12rem] h-[15rem] bg-neutral-50 flex items-center justify-center shrink-0 p-4">
                            {image ? (
                              <img src={image} alt={prod.product_title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                            ) : (
                              <span className="text-[1rem] text-neutral-400 uppercase tracking-widest">No Image</span>
                            )}
                          </Link>
                          <div className="flex flex-col justify-between py-2 flex-1">
                            <div>
                              <Link href={`/product/${prod._id}`} className="text-[1.6rem] font-light text-black leading-relaxed hover:underline line-clamp-2">
                                {prod.product_title}
                              </Link>
                              <span className="text-[1.2rem] text-neutral-500 uppercase tracking-widest mt-2 block">
                                {prod.brand?.brand_name || prod.brand}
                              </span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                              <span className="text-[1.8rem] font-light text-black">AED {prod.price}</span>
                              <button
                                onClick={() => removeFromWishlist(prod._id)}
                                className="text-[1.2rem] text-neutral-500 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1"
                              >
                                <Trash size={14} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-24 flex flex-col items-start gap-6 border border-neutral-200 bg-neutral-50 p-12">
                    <h4 className="text-[1.8rem] font-light text-black uppercase tracking-widest">Wishlist is Empty</h4>
                    <p className="text-[1.4rem] font-light text-neutral-500">Save products to your wishlist so you can buy them later.</p>
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <div className="flex justify-between items-end">
                  <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Shopping Cart</h2>
                  {cart?.items?.length > 0 && (
                    <button onClick={clearCart} className="text-[1.2rem] uppercase tracking-widest text-neutral-500 hover:text-black border-b border-transparent hover:border-black pb-1 transition-colors">
                      Clear Cart
                    </button>
                  )}
                </div>
                
                {cart?.items?.length > 0 ? (
                  <div className="flex flex-col gap-8">
                    {cart.items.map((item, index) => {
                      const prod = item.productId;
                      if (!prod) return null;
                      const image = (prod.images && prod.images[0]?.url) || (prod.images && prod.images[0]) || (prod.parentId?.images && prod.parentId.images[0]);
                      return (
                        <div key={index} className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-neutral-200 last:border-0 group">
                          <Link href={`/product/${prod._id}`} className="w-[12rem] h-[15rem] bg-neutral-50 flex items-center justify-center shrink-0 p-4">
                            {image ? (
                              <img src={image} alt={prod.product_title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                            ) : (
                              <span className="text-[1rem] text-neutral-400 uppercase tracking-widest">No Image</span>
                            )}
                          </Link>
                          
                          <div className="flex flex-col justify-between py-2 flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <Link href={`/product/${prod._id}`} className="text-[1.8rem] font-light text-black leading-relaxed hover:underline line-clamp-2">
                                  {prod.product_title}
                                </Link>
                                <span className="text-[1.2rem] text-neutral-500 uppercase tracking-widest mt-2 block">
                                  {prod.brand?.brand_name || prod.brand}
                                </span>
                              </div>
                              <span className="text-[1.8rem] font-light text-black shrink-0">AED {prod.price}</span>
                            </div>
                            
                            <div className="flex items-end justify-between mt-6">
                              <div className="flex items-center border border-black">
                                <button
                                  onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                                  className={`w-10 h-10 flex items-center justify-center text-[1.6rem] transition-colors ${item.quantity <= 1 ? 'text-neutral-300' : 'text-black hover:bg-neutral-100'}`}
                                >
                                  -
                                </button>
                                <span className="w-10 h-10 flex items-center justify-center text-[1.4rem] font-light">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                                  className="w-10 h-10 flex items-center justify-center text-[1.6rem] text-black hover:bg-neutral-100 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(prod._id)}
                                className="text-[1.2rem] text-neutral-500 hover:text-black uppercase tracking-widest flex items-center gap-1 transition-colors"
                              >
                                <Trash size={14} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-8 pt-8 border-t border-black flex flex-col items-end gap-6">
                      <div className="flex justify-between items-center w-full max-w-sm">
                        <span className="text-[1.4rem] uppercase tracking-widest text-black">Subtotal</span>
                        <span className="text-[2.2rem] font-light text-black">AED {cart.cartTotal}</span>
                      </div>
                      <Link href="/checkout" className="bg-black text-white text-[1.3rem] uppercase tracking-widest py-5 px-16 hover:bg-neutral-800 transition-colors flex items-center gap-3">
                        Checkout <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 flex flex-col items-start gap-6 border border-neutral-200 bg-neutral-50 p-12">
                    <h4 className="text-[1.8rem] font-light text-black uppercase tracking-widest">Your Cart is Empty</h4>
                    <p className="text-[1.4rem] font-light text-neutral-500">Add products to your cart to start shopping.</p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <div className="flex justify-between items-end">
                  <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button onClick={() => { setNewAddress({ name: "", phone: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "Home" }); setShowAddressForm(true); }} className="text-[1.2rem] uppercase tracking-widest text-neutral-500 hover:text-black border-b border-transparent hover:border-black pb-1 transition-colors">
                      + Add Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="border border-neutral-200 bg-neutral-50 p-10 flex flex-col gap-8 mb-8">
                    <h3 className="text-[1.6rem] font-light uppercase tracking-widest text-black border-b border-neutral-200 pb-4">{newAddress._id ? "Edit Address" : "Add New Address"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.name || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Phone</label>
                        <input
                          type="text"
                          required
                          value={newAddress.phone || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddress.address || newAddress.street || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Locality</label>
                        <input
                          type="text"
                          value={newAddress.locality || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">City</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">State</label>
                        <input
                          type="text"
                          required
                          value={newAddress.state || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Pincode</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pincode || newAddress.zip || ""}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Label (e.g. Home, Work)</label>
                        <input
                          type="text"
                          value={newAddress.addressType || newAddress.label || "Home"}
                          onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value })}
                          className="border-b border-neutral-300 py-3 text-[1.5rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-[1.3rem] uppercase tracking-widest py-4 px-10 transition-all">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setShowAddressForm(false)} className="text-[1.2rem] text-neutral-500 hover:text-black uppercase tracking-widest border-b border-transparent hover:border-black pb-1 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {addresses.map((addr) => (
                    <div key={addr._id || addr.id} className="border border-neutral-200 p-10 flex flex-col justify-between bg-neutral-50 relative group hover:bg-white hover:border-black transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[1.3rem] uppercase tracking-widest font-medium text-black bg-white px-3 py-1 border border-neutral-200">
                            {addr.addressType || addr.label || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[1rem] uppercase tracking-widest text-black font-medium border-b border-black">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-[1.5rem] font-light text-black leading-relaxed">
                          <p className="font-medium text-[1.6rem]">{addr.name}</p>
                          <p className="text-neutral-500">{addr.phone}</p>
                          <p className="line-clamp-2 mt-2">{addr.address || addr.street}</p>
                          <p>{addr.locality && `${addr.locality}, `}{addr.city}, {addr.state}</p>
                          <p className="mt-2 text-neutral-500">{addr.pincode || addr.zip}</p>
                        </div>
                      </div>
                      <div className="absolute top-10 right-10 flex gap-4">
                        <button
                          onClick={() => {
                            setNewAddress(addr);
                            setShowAddressForm(true);
                          }}
                          className="text-neutral-400 hover:text-black transition-colors"
                          title="Edit Address"
                        >
                          <Pencil size={20} weight="light" />
                        </button>
                        <button
                          onClick={() => handleRemoveAddress(addr._id || addr.id)}
                          className="text-neutral-400 hover:text-black transition-colors"
                          title="Delete Address"
                        >
                          <Trash size={20} weight="light" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {addresses.length === 0 && !showAddressForm && (
                  <p className="text-[1.4rem] font-light text-neutral-500">You haven't saved any addresses yet.</p>
                )}
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Change Password</h2>
                <form onSubmit={handlePasswordSave} className="flex flex-col gap-8 max-w-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="border-b border-neutral-300 py-3 text-[1.6rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="border-b border-neutral-300 py-3 text-[1.6rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[1.1rem] uppercase tracking-widest text-neutral-500">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="border-b border-neutral-300 py-3 text-[1.6rem] font-light text-black focus:border-black outline-none transition-colors bg-transparent"
                    />
                  </div>
                  <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-[1.3rem] uppercase tracking-widest py-5 px-12 self-start mt-6 transition-all">
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === "settings" && (
              <div className="flex flex-col gap-12 animate-fade-in">
                <h2 className="text-[2.2rem] font-light text-black uppercase tracking-widest">Account Settings</h2>
                <div className="flex flex-col gap-8 max-w-4xl">
                  
                  <div className="flex justify-between items-start border-b border-neutral-200 pb-8">
                    <div className="max-w-md">
                      <h4 className="text-[1.4rem] uppercase tracking-widest text-black mb-2">Email Notifications</h4>
                      <p className="text-[1.3rem] font-light text-neutral-500">Receive emails about new products and promotions.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none peer-checked:bg-black transition-colors"></div>
                      <div className="absolute left-[2px] top-[2px] bg-white border border-neutral-300 h-6 w-6 transition-transform peer-checked:translate-x-full"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-start border-b border-neutral-200 pb-8">
                    <div className="max-w-md">
                      <h4 className="text-[1.4rem] uppercase tracking-widest text-black mb-2">Order Updates</h4>
                      <p className="text-[1.3rem] font-light text-neutral-500">Receive tracking updates and delivery emails.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-14 h-7 bg-neutral-200 peer-focus:outline-none peer-checked:bg-black transition-colors"></div>
                      <div className="absolute left-[2px] top-[2px] bg-white border border-neutral-300 h-6 w-6 transition-transform peer-checked:translate-x-full"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-start pt-8">
                    <div className="max-w-md">
                      <h4 className="text-[1.4rem] uppercase tracking-widest text-black mb-2">Deactivate Account</h4>
                      <p className="text-[1.3rem] font-light text-neutral-500">Permanently close and deactivate your customer account.</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
                          await deactivateAccount();
                        }
                      }}
                      className="border border-black text-black hover:bg-black hover:text-white px-8 py-4 text-[1.2rem] uppercase tracking-widest transition-colors"
                    >
                      Deactivate
                    </button>
                  </div>

                </div>
              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
};

const ProfilePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner className="w-[4rem] h-[4rem] animate-spin text-black" />
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePage;
