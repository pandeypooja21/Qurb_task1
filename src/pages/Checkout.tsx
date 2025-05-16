
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cartItems, subtotal, discount, total } = useCart();
  const regularItems = cartItems.filter(item => !item.isFree);

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
        {cartItems.length > 0 && (
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <span className="font-bold">${total.toFixed(2)}</span>
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>

              {discount > 0 && (
                <div className="mt-4 bg-green-50 border border-green-100 p-3 rounded-md">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Applied Offers</h3>
                  <ul className="text-xs text-green-700 list-disc list-inside">
                    {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coca-cola')) && (
                      <li>Buy 6 Coca-Cola cans, get 1 free</li>
                    )}
                    {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coffee')) && (
                      <li>Buy 3 croissants, get a free coffee</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Applied Offers - Only visible on small screens */}
        {discount > 0 && (
          <div className="lg:hidden mt-6">
            <div className="bg-green-50 border border-green-100 p-3 rounded-md">
              <h3 className="text-sm font-medium text-green-800 mb-1">Applied Offers</h3>
              <ul className="text-xs text-green-700 list-disc list-inside">
                {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coca-cola')) && (
                  <li>Buy 6 Coca-Cola cans, get 1 free</li>
                )}
                {cartItems.some(item => item.isFree && item.product.product_name.toLowerCase().includes('coffee')) && (
                  <li>Buy 3 croissants, get a free coffee</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
