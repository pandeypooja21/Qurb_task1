
import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Safety check - if item is undefined or null, don't render anything
  if (!item || !item.product) {
    return null;
  }

  const handleIncrement = () => {
    if (!item.isFree) {
      // Get all items of the same product (excluding free items)
      const { cartItems } = useCart();
      const sameProductItems = cartItems.filter(
        cartItem =>
          (cartItem.product.product_code === item.product.product_code ||
           cartItem.product.id === item.product.id) &&
          !cartItem.isFree
      );

      // Calculate total quantity of this product in cart
      const totalQuantityInCart = sameProductItems.reduce(
        (sum, cartItem) => sum + cartItem.quantity,
        0
      );

      // Check if adding one more would exceed stock
      if (totalQuantityInCart < item.product.stock) {
        updateQuantity(item.product.product_code, item.quantity + 1);

        // Show offer notifications for Coca-Cola
        if (item.quantity === 5 &&
            (item.product.product_name.toLowerCase().includes('coca-cola') ||
             item.product.id === 642)) {
          toast({
            title: 'Almost there!',
            description: 'Add one more Coca-Cola to get one free!',
            duration: 3000,
          });
        }

        // Show offer notifications for Croissants
        if (item.quantity === 2 &&
            (item.product.product_name.toLowerCase().includes('croissant') ||
             item.product.id === 532)) {
          toast({
            title: 'Special offer!',
            description: 'Add one more croissant to get a free coffee!',
            duration: 3000,
          });
        }
      } else {
        toast({
          title: 'Maximum stock reached',
          description: `Sorry, we only have ${item.product.stock} ${item.product.product_name} in stock.`,
          duration: 3000,
        });
      }
    }
  };

  const handleDecrement = () => {
    if (!item.isFree && item.quantity > 1) {
      updateQuantity(item.product.product_code, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (!item.isFree) {
      removeFromCart(item.product.product_code);
      toast({
        title: 'Removed from cart',
        description: `${item.product.product_name} has been removed from your cart.`,
        duration: 2000,
      });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-100 last:border-0 ${item.isFree ? 'bg-green-50' : ''}`}>
      <div className="h-20 w-20 sm:h-16 sm:w-16 mb-3 sm:mb-0 sm:mr-4 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
        <img
          src={item.product.image || 'https://via.placeholder.com/150'}
          alt={item.product.product_name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="text-center sm:text-left mb-3 sm:mb-0">
            <div className="flex items-center">
              <h3 className="font-medium">{item.product.product_name}</h3>
              {item.isFree && (
                <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200 ml-2">
                  FREE
                </Badge>
              )}
            </div>

            <div className="text-sm text-gray-500 mt-1">
              {item.isFree ? (
                <span className="line-through mr-2">${item.product.price.toFixed(2)}</span>
              ) : (
                <span>${item.product.price.toFixed(2)}</span>
              )}

              {item.isFree && (
                <span className="text-green-600 font-medium">$0.00</span>
              )}
            </div>

            {item.isFree && (
              <div className="text-xs text-green-600 mt-1">
                {item.product.product_name.toLowerCase().includes('coca-cola') ?
                  'Free with purchase of 6 Coca-Cola' :
                  'Free with purchase of 3 Croissants'}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center sm:justify-end">
            {!item.isFree ? (
              <>
                <div className="flex items-center mr-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-7 sm:w-7"
                    onClick={handleDecrement}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="mx-2 min-w-[24px] text-center">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-7 sm:w-7"
                    onClick={handleIncrement}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-7 sm:w-7 text-red-500" onClick={handleRemove}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-sm mr-2 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">×{item.quantity}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
