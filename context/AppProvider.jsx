"use client";

import { CartProvider } from "./cartContext";
import { UserProvider } from "./userContext";
import { WishlistProvider } from "./wishlistContext";

const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </UserProvider>
  );
};

export default AppProvider;
