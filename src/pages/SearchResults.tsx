
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Navbar from '../components/Navbar';
import { Product } from '../context/CartContext';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All items', 'Drinks', 'Fruit', 'Bakery'];

const SearchResults: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts(selectedCategory);
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const searchTermLower = searchTerm.toLowerCase().trim();
      const filtered = products.filter(product => {
        const nameMatch = product.product_name.toLowerCase().includes(searchTermLower);
        const categoryMatch = product.category?.toLowerCase().includes(searchTermLower);
        return nameMatch || categoryMatch;
      });
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);

  const handleCategoryChange = (category: string) => {
    let apiCategory = category;

    // Map UI categories to API categories
    if (category === 'all items') {
      apiCategory = 'all';
    } else if (category === 'drinks') {
      apiCategory = 'drinks';
    } else if (category === 'fruit') {
      apiCategory = 'fruit';
    } else if (category === 'bakery') {
      apiCategory = 'bakery';
    }

    setSelectedCategory(apiCategory);
    // Clear search term when changing category
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="container mx-auto px-4 pt-4 pb-16 md:px-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        <h2 className="text-xl font-bold mb-6">Trending Items</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.product_code} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching "{searchTerm}".</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
