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
  Trash
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
    }
  }, [user]);

  // If user is loading or null
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <Spinner className="w-[4rem] h-[4rem] animate-spin text-[#b00015]" />
      </div>
    );
  }

  if (user === null) {
    return (
      <section className="w-[95%] max-w-4xl mx-auto pt-[15rem] pb-24 text-center">
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 shadow-xl flex flex-col items-center gap-6">
          <User className="w-[6rem] h-[6rem] text-neutral-300" />
          <h2 className="text-3xl font-extrabold text-neutral-800">Access Denied</h2>
          <p className="text-[1.6rem] text-neutral-600">Please sign in to view your account details.</p>
          <Link href="/register/sign-in" className="mt-4 bg-[#b00015] hover:bg-red-800 text-white text-[1.5rem] font-bold px-8 py-3 rounded-full transition-all shadow-md">
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  // Handle profile form save
  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateProfile(profileData.name);
  };

  // Handle password change save
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



  // Handle address addition
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.street) return;
    const success = await addAddress(newAddress);
    if (success) {
      setNewAddress({ label: "", street: "", city: "", zip: "", country: "" });
      setShowAddressForm(false);
    }
  };

  // Remove address
  const handleRemoveAddress = async (id) => {
    await deleteAddress(id);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "profile", label: "Profile Info", icon: User },
    { id: "orders", label: "Order History", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlistItems.length },
    { id: "cart", label: "Shopping Cart", icon: ShoppingCart, badge: cart?.items?.length },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "password", label: "Change Password", icon: Key },
    { id: "settings", label: "Account Settings", icon: Gear }
  ];

  return (
    <main className="w-[95%] max-w-7xl mx-auto pt-[16rem] pb-16">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-1/4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-6 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#b00015]/10 flex items-center justify-center text-[#b00015]">
              <User className="w-[3rem] h-[3rem]" weight="bold" />
            </div>
            <div>
              <div className="text-[1.2rem] text-neutral-400 font-medium">Hello,</div>
              <h3 className="text-[1.8rem] font-bold text-neutral-800 truncate">{user.name || "Customer"}</h3>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    router.push(`/profile?tab=${item.id}`);
                  }}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[1.45rem] font-semibold transition-all ${
                    isActive
                      ? "bg-[#b00015] text-white shadow-md shadow-red-700/10"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-[2rem] h-[2rem]" weight={isActive ? "bold" : "regular"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[1.1rem] px-2.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white text-[#b00015]" : "bg-neutral-150 text-neutral-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            <button
              onClick={logoutUser}
              className="flex items-center gap-3 px-4 py-3.5 mt-4 rounded-2xl text-[1.45rem] font-semibold text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-100 pt-4"
            >
              <SignOut className="w-[2rem] h-[2rem]" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Content Display Area */}
        <section className="w-full lg:w-3/4 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm min-h-[50rem]">
          
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Account Dashboard</h2>
              <p className="text-[1.5rem] text-neutral-600 leading-relaxed">
                Welcome back, <strong className="text-neutral-800">{user.name}</strong>! From your account dashboard, you can easily view your recent orders, manage your shipping addresses, edit your profile details, and change your password.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div onClick={() => setActiveTab("orders")} className="border border-neutral-200 p-6 rounded-2xl hover:border-[#b00015] hover:shadow-lg transition-all cursor-pointer">
                  <ShoppingBag className="w-[3rem] h-[3rem] text-[#b00015] mb-3" />
                  <h4 className="text-[1.6rem] font-bold mb-1">Orders</h4>
                  <p className="text-[1.3rem] text-neutral-500">Track and review past orders.</p>
                </div>
                <div onClick={() => setActiveTab("wishlist")} className="border border-neutral-200 p-6 rounded-2xl hover:border-[#b00015] hover:shadow-lg transition-all cursor-pointer">
                  <Heart className="w-[3rem] h-[3rem] text-[#b00015] mb-3" />
                  <h4 className="text-[1.6rem] font-bold mb-1">Wishlist</h4>
                  <p className="text-[1.3rem] text-neutral-500">{wishlistItems.length} items waiting in list.</p>
                </div>
                <div onClick={() => setActiveTab("profile")} className="border border-neutral-200 p-6 rounded-2xl hover:border-[#b00015] hover:shadow-lg transition-all cursor-pointer">
                  <User className="w-[3rem] h-[3rem] text-[#b00015] mb-3" />
                  <h4 className="text-[1.6rem] font-bold mb-1">Personal Info</h4>
                  <p className="text-[1.3rem] text-neutral-500">Update your email, name, or phone.</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Profile Information</h2>
              <form onSubmit={handleProfileSave} className="flex flex-col gap-4 max-w-xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[1.3rem] font-bold text-neutral-600">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="border border-neutral-300 rounded-xl px-4 py-3 text-[1.4rem] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[1.3rem] font-bold text-neutral-600">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 text-[1.4rem] cursor-not-allowed text-neutral-500"
                  />
                  <span className="text-[1.1rem] text-neutral-400">Email addresses cannot be modified.</span>
                </div>
                <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-[1.4rem] font-bold py-3.5 px-6 rounded-xl self-start mt-2 transition-all">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Order History Tab */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Order History</h2>
              <div className="border border-neutral-200 p-8 rounded-2xl bg-neutral-50 text-center flex flex-col items-center gap-3">
                <ShoppingBag className="w-[4rem] h-[4rem] text-neutral-400" />
                <h4 className="text-[1.6rem] font-bold text-neutral-700">No Orders Found</h4>
                <p className="text-[1.3rem] text-neutral-500 max-w-md">You haven't placed any orders yet. Once you place an order, it will appear here.</p>
                <Link href="/" className="mt-2 bg-[#b00015] hover:bg-red-800 text-white font-bold text-[1.3rem] px-6 py-2.5 rounded-full transition-colors">
                  Browse Products
                </Link>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-[2.2rem] font-extrabold text-neutral-800">My Wishlist</h2>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => {
                    const prod = item.productId;
                    if (!prod) return null;
                    return (
                      <div key={item._id || prod._id} className="border border-neutral-200 rounded-2xl p-4 flex gap-4 bg-white hover:shadow-md transition-shadow relative">
                        {prod.images && prod.images.length > 0 && (
                          <img
                            src={prod.images[0].url || prod.images[0]}
                            alt={prod.product_title}
                            className="w-[10rem] h-[10rem] object-cover rounded-xl border border-neutral-100"
                          />
                        )}
                        <div className="flex flex-col justify-between py-1 flex-1">
                          <div>
                            <h4 className="text-[1.5rem] font-bold text-neutral-800 line-clamp-2">{prod.product_title}</h4>
                            <span className="text-[1.3rem] text-neutral-500 font-medium">{prod.brand?.brand_name || prod.brand}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[1.6rem] font-extrabold text-neutral-900">${prod.price}</span>
                            <button
                              onClick={() => removeFromWishlist(prod._id)}
                              className="text-neutral-400 hover:text-red-600 transition-colors"
                              title="Remove from Wishlist"
                            >
                              <Trash className="w-[2rem] h-[2rem]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-neutral-250 p-8 rounded-2xl bg-neutral-50 text-center flex flex-col items-center gap-3">
                  <Heart className="w-[4rem] h-[4rem] text-neutral-400" />
                  <h4 className="text-[1.6rem] font-bold text-neutral-700">Wishlist is Empty</h4>
                  <p className="text-[1.3rem] text-neutral-500">Save products to your wishlist so you can buy them later.</p>
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Shopping Cart</h2>
                {cart?.items?.length > 0 && (
                  <button onClick={clearCart} className="text-[1.3rem] font-bold text-red-600 hover:underline">
                    Clear Cart
                  </button>
                )}
              </div>
              {cart?.items?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {cart.items.map((item, index) => {
                    const prod = item.productId;
                    if (!prod) return null;
                    return (
                      <div key={index} className="border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-4">
                          {prod.images && prod.images.length > 0 && (
                            <img
                              src={prod.images[0].url || prod.images[0]}
                              alt={prod.product_title}
                              className="w-[8rem] h-[8rem] object-cover rounded-xl border border-neutral-100"
                            />
                          )}
                          <div>
                            <h4 className="text-[1.5rem] font-bold text-neutral-800 max-w-sm line-clamp-1">{prod.product_title}</h4>
                            <span className="text-[1.3rem] text-neutral-500 font-medium">{prod.brand?.brand_name || prod.brand}</span>
                            <div className="text-[1.4rem] font-bold text-neutral-700 mt-1">${prod.price}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 self-end sm:self-center">
                          <div className="flex items-center border border-neutral-300 rounded-full">
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                              className="px-3.5 py-1 text-[1.6rem] font-bold text-neutral-600 hover:text-black"
                            >
                              -
                            </button>
                            <span className="px-3 text-[1.4rem] font-bold text-neutral-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                              className="px-3.5 py-1 text-[1.6rem] font-bold text-neutral-600 hover:text-black"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(prod._id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                          >
                            <Trash className="w-[2rem] h-[2rem]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t border-neutral-200 pt-6 mt-4 flex justify-between items-center">
                    <span className="text-[1.6rem] font-bold text-neutral-600">Subtotal:</span>
                    <span className="text-[2.2rem] font-extrabold text-neutral-900">${cart.cartTotal}</span>
                  </div>
                  <Link href="/checkout" className="bg-[#b00015] hover:bg-red-800 text-white font-bold text-[1.5rem] py-3.5 rounded-full text-center mt-4 transition-all">
                    Proceed to Checkout
                  </Link>
                </div>
              ) : (
                <div className="border border-neutral-250 p-8 rounded-2xl bg-neutral-50 text-center flex flex-col items-center gap-3">
                  <ShoppingCart className="w-[4rem] h-[4rem] text-neutral-400" />
                  <h4 className="text-[1.6rem] font-bold text-neutral-700">Your Cart is Empty</h4>
                  <p className="text-[1.3rem] text-neutral-500">Add products to your cart to start shopping.</p>
                </div>
              )}
            </div>
          )}

          {/* Saved Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Saved Addresses</h2>
                {!showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)} className="bg-black hover:bg-neutral-800 text-white text-[1.3rem] font-bold px-4 py-2 rounded-xl transition-all">
                    Add New Address
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="border border-neutral-200 rounded-2xl p-6 flex flex-col gap-4 bg-neutral-50">
                  <h3 className="text-[1.6rem] font-bold text-neutral-800">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[1.2rem] font-bold text-neutral-500">Address Label (e.g. Home, Office)</label>
                      <input
                        type="text"
                        required
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="border border-neutral-300 rounded-xl px-4 py-2.5 text-[1.4rem] outline-none bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[1.2rem] font-bold text-neutral-500">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="border border-neutral-300 rounded-xl px-4 py-2.5 text-[1.4rem] outline-none bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[1.2rem] font-bold text-neutral-500">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="border border-neutral-300 rounded-xl px-4 py-2.5 text-[1.4rem] outline-none bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[1.2rem] font-bold text-neutral-500">Zip / Postal Code</label>
                      <input
                        type="text"
                        required
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="border border-neutral-300 rounded-xl px-4 py-2.5 text-[1.4rem] outline-none bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[1.2rem] font-bold text-neutral-500">Country</label>
                      <input
                        type="text"
                        required
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        className="border border-neutral-300 rounded-xl px-4 py-2.5 text-[1.4rem] outline-none bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-2">
                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-[1.4rem] font-bold text-neutral-600 px-4 py-2 hover:underline">
                      Cancel
                    </button>
                    <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-[1.4rem] font-bold px-6 py-2.5 rounded-xl transition-all">
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr._id || addr.id} className="border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between bg-white relative">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[1.5rem] font-bold text-neutral-850">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[1rem] bg-[#b00015]/10 text-[#b00015] font-bold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[1.4rem] text-neutral-600 font-medium">{addr.street}</p>
                      <p className="text-[1.3rem] text-neutral-500">{addr.city}, {addr.zip}</p>
                      <p className="text-[1.3rem] text-neutral-500">{addr.country}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveAddress(addr._id || addr.id)}
                      className="absolute top-6 right-6 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Address"
                    >
                      <Trash className="w-[1.8rem] h-[1.8rem]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Change Password</h2>
              <form onSubmit={handlePasswordSave} className="flex flex-col gap-4 max-w-xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[1.3rem] font-bold text-neutral-600">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="border border-neutral-300 rounded-xl px-4 py-3 text-[1.4rem] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[1.3rem] font-bold text-neutral-600">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="border border-neutral-300 rounded-xl px-4 py-3 text-[1.4rem] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[1.3rem] font-bold text-neutral-600">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="border border-neutral-300 rounded-xl px-4 py-3 text-[1.4rem] focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 outline-none"
                  />
                </div>
                <button type="submit" className="bg-black hover:bg-neutral-800 text-white text-[1.4rem] font-bold py-3.5 px-6 rounded-xl self-start mt-2 transition-all">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-[2.2rem] font-extrabold text-neutral-800">Account Settings</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-neutral-100 py-4">
                  <div>
                    <h4 className="text-[1.5rem] font-bold text-neutral-800">Email Notifications</h4>
                    <p className="text-[1.2rem] text-neutral-500">Receive emails about new products and promotions.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#b00015]" />
                </div>
                <div className="flex justify-between items-center border-b border-neutral-100 py-4">
                  <div>
                    <h4 className="text-[1.5rem] font-bold text-neutral-800">Order Updates</h4>
                    <p className="text-[1.2rem] text-neutral-500">Receive tracking updates and delivery emails.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#b00015]" />
                </div>
                <div className="flex justify-between items-center py-4">
                  <div>
                    <h4 className="text-[1.5rem] font-bold text-red-650">Deactivate Account</h4>
                    <p className="text-[1.2rem] text-neutral-500">Permanently close and deactivate your customer account.</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
                        await deactivateAccount();
                      }
                    }}
                    className="border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-[1.3rem] font-bold transition-colors"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>

      </div>
    </main>
  );
};

const ProfilePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <Spinner className="w-[4rem] h-[4rem] animate-spin text-[#b00015]" />
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePage;
