
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Checkout: React.FC = () => {
  const { cartItems, subtotal, discount, total } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Handle page refresh and ensure cart is loaded
  useEffect(() => {
    // Short timeout to ensure cart context is properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false);

      // If cart is empty after loading, show a message
      if (cartItems.length === 0) {
        toast({
          title: "Cart is empty",
          description: "Your cart appears to be empty. Redirecting to the shop.",
          duration: 3000,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cartItems]);

  const regularItems = cartItems.filter(item => !item.isFree || false);

  // Show loading state or redirect if cart is empty
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-primary">
            <ArrowLeft className="mr-1 h-4 w-4" /> Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold mt-2">Your Cart</h1>
        </div>

        {/* Mobile Order Summary - Only visible on small screens */}
        {cartItems && cartItems.length > 0 && (
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <span className="font-bold">${(total || 0).toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              {cartItems.length > 0 ? (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium">Items ({regularItems.length})</h2>
                    {discount > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        Savings: ${discount.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div>
                    {cartItems.map(item => (
                      <CartItem key={`${item.product.product_code}-${item.isFree ? 'free' : 'paid'}`} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-lg font-medium mb-2">Your cart is empty</h2>
                  <p className="text-gray-500 mb-6">Looks like you haven't added any products yet.</p>
                  <Link to="/">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Order Summary - Hidden on small screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(subtotal || 0).toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 4.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zM11 12a1 1 0 100-2h-1a1 1 0 100 2h1z" clipRule="evenodd" />
                      </svg>
                      Discount
                    </span>
                    <span>-${(discount || 0).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${(total || 0).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>

              {discount > 0 && (
                <div className="mt-4 bg-green-50 border border-green-100 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-sm font-medium text-green-800">Applied Offers</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-2">
                    {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coca-cola')) && (
                      <li className="flex items-start">
                        <span className="flex w-4 h-4 bg-green-200 rounded-full text-green-700 text-xs items-center justify-center mr-2 mt-0.5">✓</span>
                        <span>Buy 6 Coca-Cola cans, get 1 free</span>
                      </li>
                    )}
                    {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coffee')) && (
                      <li className="flex items-start">
                        <span className="flex w-4 h-4 bg-green-200 rounded-full text-green-700 text-xs items-center justify-center mr-2 mt-0.5">✓</span>
                        <span>Buy 3 croissants, get a free coffee</span>
                      </li>
                    )}
                  </ul>
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    You saved ${(discount || 0).toFixed(2)} with these offers!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Applied Offers - Only visible on small screens */}
        {discount > 0 && (
          <div className="lg:hidden mt-6">
            <div className="bg-green-50 border border-green-100 p-4 rounded-md">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-sm font-medium text-green-800">Applied Offers</h3>
              </div>
              <ul className="text-sm text-green-700 space-y-2">
                {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coca-cola')) && (
                  <li className="flex items-start">
                    <span className="flex w-4 h-4 bg-green-200 rounded-full text-green-700 text-xs items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>Buy 6 Coca-Cola cans, get 1 free</span>
                  </li>
                )}
                {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coffee')) && (
                  <li className="flex items-start">
                    <span className="flex w-4 h-4 bg-green-200 rounded-full text-green-700 text-xs items-center justify-center mr-2 mt-0.5">✓</span>
                    <span>Buy 3 croissants, get a free coffee</span>
                  </li>
                )}
              </ul>
              <div className="mt-2 text-xs text-green-600 font-medium">
                You saved ${(discount || 0).toFixed(2)} with these offers!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
