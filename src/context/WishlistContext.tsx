import React, { createContext, useContext, useState } from 'react';
import { Product } from './CartContext';

type WishlistContextType = {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productCode: string) => void;
  isInWishlist: (productCode: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  
  // Add a product to wishlist
  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product_code === product.product_code
      );
      
      if (existingItem) {
        return prevItems;
      } else {
        return [...prevItems, product];
      }
    });
  };
  
  // Remove a product from wishlist
  const removeFromWishlist = (productCode: string) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.product_code !== productCode)
    );
  };
  
  // Check if a product is in the wishlist
  const isInWishlist = (productCode: string): boolean => {
    return wishlistItems.some(item => item.product_code === productCode);
  };
  
  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, addToWishlist, removeFromWishlist, isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
