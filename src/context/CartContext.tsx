
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Define our types
export type Product = {
  product_code: string;
  product_name: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  id?: number;
  description?: string;
  rating?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  isFree?: boolean;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productCode: string) => void;
  updateQuantity: (productCode: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // Apply offers and calculate totals
  useEffect(() => {
    // Skip processing if cart is empty
    if (cartItems.length === 0) {
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);
      return;
    }

    // Calculate subtotal from non-free items
    const calcSubtotal = cartItems.reduce((sum, item) => {
      if (!item.isFree) {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    // Apply offers
    let discountAmount = 0;
    let updatedCart = [...cartItems];

    // ===== OFFER 1: Buy 6 Coca-Cola cans, get 1 free =====
    // Find all Coca-Cola items
    const cokeItems = cartItems.filter(item =>
      item.product.product_name.toLowerCase().includes('coca-cola') ||
      (item.product.id === 642) // ID for Coca-Cola from API
    );

    // Separate regular and free items
    const regularCokeItems = cokeItems.filter(item => !item.isFree);
    const freeCokeItems = cokeItems.filter(item => item.isFree);

    // Calculate how many free cokes the customer is eligible for
    const totalCokeQuantity = regularCokeItems.reduce((sum, item) => sum + item.quantity, 0);
    const freeCokesEligible = Math.floor(totalCokeQuantity / 6);

    // Process free Coca-Cola offer
    if (freeCokesEligible > 0 && regularCokeItems.length > 0) {
      const cokeProduct = regularCokeItems[0].product;

      // Check if we already have free coke items
      if (freeCokeItems.length > 0) {
        // Update quantity if needed
        if (freeCokeItems[0].quantity !== freeCokesEligible) {
          updatedCart = updatedCart.map(item => {
            if (item.isFree && (
              item.product.product_name.toLowerCase().includes('coca-cola') ||
              item.product.id === 642
            )) {
              return { ...item, quantity: freeCokesEligible };
            }
            return item;
          });

          // Show toast notification about the updated free items
          toast({
            title: 'Offer Applied!',
            description: `You now have ${freeCokesEligible} free Coca-Cola${freeCokesEligible > 1 ? 's' : ''} in your cart!`,
            duration: 3000,
          });
        }
      } else {
        // Add free coke items
        const freeCokeItem: CartItem = {
          product: {
            ...cokeProduct,
            product_code: `${cokeProduct.product_code}-free`
          },
          quantity: freeCokesEligible,
          isFree: true
        };
        updatedCart = [...updatedCart, freeCokeItem];

        // Show toast notification about the new free items
        toast({
          title: 'Offer Applied!',
          description: `${freeCokesEligible} free Coca-Cola${freeCokesEligible > 1 ? 's have' : ' has'} been added to your cart!`,
          duration: 3000,
        });
      }

      // Calculate discount (price of one Coca-Cola × number of free ones)
      discountAmount += cokeProduct.price * freeCokesEligible;
    } else {
      // Remove any free cokes if no longer eligible
      const hadFreeCokes = updatedCart.some(item =>
        item.isFree && (
          item.product.product_name.toLowerCase().includes('coca-cola') ||
          item.product.id === 642
        )
      );

      updatedCart = updatedCart.filter(item =>
        !(item.isFree && (
          item.product.product_name.toLowerCase().includes('coca-cola') ||
          item.product.id === 642
        ))
      );

      // Show toast notification if free items were removed
      if (hadFreeCokes) {
        toast({
          title: 'Offer Removed',
          description: 'You no longer qualify for free Coca-Cola. Add more to your cart to qualify!',
          duration: 3000,
        });
      }
    }

    // ===== OFFER 2: Buy 3 croissants, get a free coffee =====
    // Find all croissant items
    const croissantItems = cartItems.filter(item =>
      (item.product.product_name.toLowerCase().includes('croissant') ||
      item.product.id === 532) && // ID for Croissants from API
      !item.isFree
    );

    // Find all coffee items
    const coffeeItems = cartItems.filter(item =>
      (item.product.product_name.toLowerCase().includes('coffee') ||
      item.product.id === 641) && // ID for Coffee from API
      item.isFree
    );

    const regularCoffeeItems = cartItems.filter(item =>
      (item.product.product_name.toLowerCase().includes('coffee') ||
      item.product.id === 641) &&
      !item.isFree
    );

    // Calculate how many free coffees the customer is eligible for
    const totalCroissants = croissantItems.reduce((sum, item) => sum + item.quantity, 0);
    const freeCoffeeEligible = Math.floor(totalCroissants / 3);

    // Process free coffee offer
    if (freeCoffeeEligible > 0) {
      // Try to find coffee in the cart, or use API data
      let coffeeProduct = regularCoffeeItems.length > 0
        ? regularCoffeeItems[0].product
        : {
            product_code: 'coffee-641',
            product_name: 'Coffee',
            price: 0.65, // Price from API
            stock: 10,   // Stock from API
            category: 'drinks',
            id: 641,
            image: 'https://py-shopping-cart.s3.eu-west-2.amazonaws.com/coffee.jpeg' // Image from API
          };

      // Check if we already have free coffee items
      if (coffeeItems.length > 0) {
        // Update quantity if needed
        if (coffeeItems[0].quantity !== freeCoffeeEligible) {
          updatedCart = updatedCart.map(item => {
            if (item.isFree && (
              item.product.product_name.toLowerCase().includes('coffee') ||
              item.product.id === 641
            )) {
              return { ...item, quantity: freeCoffeeEligible };
            }
            return item;
          });

          // Show toast notification about the updated free items
          toast({
            title: 'Offer Applied!',
            description: `You now have ${freeCoffeeEligible} free coffee${freeCoffeeEligible > 1 ? 's' : ''} in your cart!`,
            duration: 3000,
          });
        }
      } else {
        // Add free coffee items
        const freeCoffeeItem: CartItem = {
          product: {
            ...coffeeProduct,
            product_code: `${coffeeProduct.product_code}-free`
          },
          quantity: freeCoffeeEligible,
          isFree: true
        };
        updatedCart = [...updatedCart, freeCoffeeItem];

        // Show toast notification about the new free items
        toast({
            title: 'Offer Applied!',
            description: `${freeCoffeeEligible} free coffee${freeCoffeeEligible > 1 ? 's have' : ' has'} been added to your cart!`,
            duration: 3000,
        });
      }

      // Calculate discount (price of one coffee × number of free ones)
      discountAmount += coffeeProduct.price * freeCoffeeEligible;
    } else {
      // Remove any free coffees if no longer eligible
      const hadFreeCoffees = updatedCart.some(item =>
        item.isFree && (
          item.product.product_name.toLowerCase().includes('coffee') ||
          item.product.id === 641
        )
      );

      updatedCart = updatedCart.filter(item =>
        !(item.isFree && (
          item.product.product_name.toLowerCase().includes('coffee') ||
          item.product.id === 641
        ))
      );

      // Show toast notification if free items were removed
      if (hadFreeCoffees) {
        toast({
          title: 'Offer Removed',
          description: 'You no longer qualify for free coffee. Add more croissants to your cart to qualify!',
          duration: 3000,
        });
      }
    }

    // If the cart changed due to offers, update it
    if (JSON.stringify(updatedCart) !== JSON.stringify(cartItems)) {
      setCartItems(updatedCart);
    }

    // Update state with calculated values
    setSubtotal(calcSubtotal);
    setDiscount(discountAmount);
    setTotal(calcSubtotal - discountAmount);

  }, [cartItems]);

  // Add a product to cart
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      // Find existing item by product code or id
      const existingItemIndex = prevItems.findIndex(
        item =>
          (item.product.product_code === product.product_code ||
           item.product.id === product.id) &&
          !item.isFree
      );

      if (existingItemIndex >= 0) {
        // Check if adding one more would exceed stock
        const currentQuantity = prevItems[existingItemIndex].quantity;
        if (currentQuantity >= product.stock) {
          // Don't add more if it would exceed stock
          return prevItems;
        }

        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  // Remove a product from cart
  const removeFromCart = (productCode: string) => {
    setCartItems(prevItems => {
      // Find the item to remove
      const itemToRemove = prevItems.find(item => item.product.product_code === productCode);

      if (itemToRemove) {
        // Remove by product code or id
        return prevItems.filter(item =>
          item.product.product_code !== productCode &&
          (itemToRemove.product.id ? item.product.id !== itemToRemove.product.id : true)
        );
      }

      return prevItems;
    });
  };

  // Update the quantity of a product
  const updateQuantity = (productCode: string, quantity: number) => {
    setCartItems(prevItems => {
      // Find the item to update
      const itemToUpdate = prevItems.find(item =>
        item.product.product_code === productCode && !item.isFree
      );

      if (!itemToUpdate) {
        return prevItems;
      }

      return prevItems.map(item => {
        // Match by product code or id
        if ((item.product.product_code === productCode ||
             (itemToUpdate.product.id && item.product.id === itemToUpdate.product.id)) &&
            !item.isFree) {
          return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
      }).filter(item => item.quantity > 0 || item.isFree);
    });
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      subtotal, discount, total
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
