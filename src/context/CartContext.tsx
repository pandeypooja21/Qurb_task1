
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define our types
export type Product = {
  product_code: string;
  product_name: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
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
    const calcSubtotal = cartItems.reduce((sum, item) => {
      if (!item.isFree) {
        return sum + (item.product.price * item.quantity);
      }
      return sum;
    }, 0);

    // Apply offers
    let discountAmount = 0;
    let updatedCart = [...cartItems];

    // Offer 1: Buy 6 Coca-Cola cans, get 1 free
    const cokeItems = cartItems.filter(item => item.product.product_name.toLowerCase().includes('coca-cola'));
    const regularCokeItems = cokeItems.filter(item => !item.isFree);
    const freeCokeItems = cokeItems.filter(item => item.isFree);

    const totalCokeQuantity = regularCokeItems.reduce((sum, item) => sum + item.quantity, 0);
    const freeCokesEligible = Math.floor(totalCokeQuantity / 6);

    // Handle free cokes
    if (freeCokesEligible > 0) {
      // If we already have free coke items
      if (freeCokeItems.length > 0) {
        // Update quantity if needed
        if (freeCokeItems[0].quantity !== freeCokesEligible) {
          updatedCart = updatedCart.map(item => {
            if (item.isFree && item.product.product_name.toLowerCase().includes('coca-cola')) {
              return { ...item, quantity: freeCokesEligible };
            }
            return item;
          });
        }
      } else {
        // Add free coke
        if (regularCokeItems.length > 0) {
          const freeCokeItem: CartItem = {
            product: regularCokeItems[0].product,
            quantity: freeCokesEligible,
            isFree: true
          };
          updatedCart = [...updatedCart, freeCokeItem];
        }
      }

      // Calculate discount
      discountAmount += regularCokeItems[0]?.product.price * freeCokesEligible || 0;
    } else {
      // Remove any free cokes if no longer eligible
      updatedCart = updatedCart.filter(item =>
        !(item.isFree && item.product.product_name.toLowerCase().includes('coca-cola'))
      );
    }

    // Offer 2: Buy 3 croissants, get a free coffee
    const croissantItems = cartItems.filter(item =>
      item.product.product_name.toLowerCase().includes('croissant') && !item.isFree
    );
    const coffeeItems = cartItems.filter(item =>
      item.product.product_name.toLowerCase().includes('coffee') && item.isFree
    );

    const totalCroissants = croissantItems.reduce((sum, item) => sum + item.quantity, 0);
    const freeCoffeeEligible = Math.floor(totalCroissants / 3);

    // Handle free coffee
    if (freeCoffeeEligible > 0) {
      // Check if we need to add a free coffee
      if (coffeeItems.length === 0) {
        // Find a coffee product in the cart
        let coffeeProduct = cartItems.find(item =>
          item.product.product_name.toLowerCase().includes('coffee') && !item.isFree
        );

        // If no coffee in cart, create a default coffee product
        if (!coffeeProduct) {
          coffeeProduct = {
            product: {
              product_code: 'coffee-free',
              product_name: 'Coffee',
              price: 2.99,
              stock: 100,
              category: 'drinks',
              image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=300'
            },
            quantity: 1
          };
        }

        const freeCoffeeItem: CartItem = {
          product: coffeeProduct.product,
          quantity: freeCoffeeEligible,
          isFree: true
        };
        updatedCart = [...updatedCart, freeCoffeeItem];
        discountAmount += coffeeProduct.product.price * freeCoffeeEligible;
      } else {
        // Update quantity if needed
        if (coffeeItems[0].quantity !== freeCoffeeEligible) {
          updatedCart = updatedCart.map(item => {
            if (item.isFree && item.product.product_name.toLowerCase().includes('coffee')) {
              return { ...item, quantity: freeCoffeeEligible };
            }
            return item;
          });

          const coffeePrice = coffeeItems[0].product.price;
          discountAmount += coffeePrice * freeCoffeeEligible;
        } else {
          const coffeePrice = coffeeItems[0].product.price;
          discountAmount += coffeePrice * freeCoffeeEligible;
        }
      }
    } else {
      // Remove free coffee if no longer eligible
      updatedCart = updatedCart.filter(item =>
        !(item.isFree && item.product.product_name.toLowerCase().includes('coffee'))
      );
    }

    // If the cart changed due to offers, update it
    if (JSON.stringify(updatedCart) !== JSON.stringify(cartItems)) {
      setCartItems(updatedCart);
    }

    setSubtotal(calcSubtotal);
    setDiscount(discountAmount);
    setTotal(calcSubtotal - discountAmount);

  }, [cartItems]);

  // Add a product to cart
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.product_code === product.product_code && !item.isFree
      );

      if (existingItemIndex >= 0) {
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
    setCartItems(prevItems => prevItems.filter(item => item.product.product_code !== productCode));
  };

  // Update the quantity of a product
  const updateQuantity = (productCode: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.product.product_code === productCode && !item.isFree) {
          return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
      }).filter(item => item.quantity > 0 || item.isFree)
    );
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
