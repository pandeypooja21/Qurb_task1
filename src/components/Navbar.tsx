
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, onSearchChange }) => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = cartItems.filter(item => !item.isFree).length;
  const wishlistItemCount = wishlistItems.length;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold mr-4">
              GROCERIES
            </Link>
          </div>

          {/* Search bar - hidden on small screens */}
          <div className="relative flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-10 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <div className="absolute right-3 flex space-x-1">
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <ArrowLeft className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link to="#" className="relative">
              <Heart className="h-6 w-6 text-gray-500" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            <Link to="#" className="relative">
              <User className="h-6 w-6 text-gray-500" />
            </Link>

            <Link to="/checkout" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-500" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-gray-100">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="flex justify-around">
              <Link to="#" className="relative flex flex-col items-center p-2">
                <Heart className="h-6 w-6 text-gray-500 mb-1" />
                <span className="text-xs">Wishlist</span>
                {wishlistItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>

              <Link to="#" className="relative flex flex-col items-center p-2">
                <User className="h-6 w-6 text-gray-500 mb-1" />
                <span className="text-xs">Account</span>
              </Link>

              <Link to="/checkout" className="relative flex flex-col items-center p-2">
                <ShoppingCart className="h-6 w-6 text-gray-500 mb-1" />
                <span className="text-xs">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
