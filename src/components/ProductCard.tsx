
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Product, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showGoToCart, setShowGoToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize favorite state from wishlist context
  useEffect(() => {
    setIsFavorite(isInWishlist(product.product_code));
  }, [product.product_code, isInWishlist]);

  const isAvailable = product.stock > 0;
  const isLimited = product.stock > 0 && product.stock < 10;

  const handleAddToCart = () => {
    addToCart(product);
    setShowGoToCart(true);

    toast({
      title: 'Added to cart',
      description: `${product.product_name} has been added to your cart.`,
      duration: 3000,
    });

    // Hide go to cart button after 5 seconds
    setTimeout(() => {
      setShowGoToCart(false);
    }, 5000);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    if (newFavoriteState) {
      addToWishlist(product);
      toast({
        title: 'Added to wishlist',
        description: `${product.product_name} has been added to your wishlist.`,
        duration: 2000,
      });
    } else {
      removeFromWishlist(product.product_code);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:shadow-md">
      <div className="relative w-full h-40 bg-gray-100 p-4 flex items-center justify-center">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.product_name}
          className="w-auto h-auto max-w-full max-h-full object-contain"
        />
        <div className="absolute top-2 right-2">
          {isLimited ? (
            <Badge className="bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-100">
              Only {product.stock} left
            </Badge>
          ) : isAvailable ? (
            <Badge className="bg-green-100 text-green-600 border-green-200 hover:bg-green-100">
              Available
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100">
              Out of Stock
            </Badge>
          )}
        </div>
        <button
          onClick={toggleFavorite}
          className="absolute top-2 left-2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="flex flex-col flex-grow p-4">
        <h3 className="font-medium text-lg mb-1">{product.product_name}</h3>

        {/* Display rating if available */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(product.rating || 0)
                      ? 'text-yellow-400'
                      : star <= (product.rating || 0)
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description ||
            (product.category === 'fruit'
              ? `Fresh ${product.product_name.toLowerCase()} from our trusted suppliers`
              : product.category === 'bakery'
              ? `Freshly baked ${product.product_name.toLowerCase()}`
              : `Refreshing ${product.product_name.toLowerCase()}`)}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>

          {showGoToCart ? (
            <Link to="/checkout">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" /> Go to Cart
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              size="sm"
              className={isAvailable ? "bg-gray-900 hover:bg-gray-800 text-white" : ""}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
