
import { Product } from '../context/CartContext';

const API_BASE_URL = 'https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s';

// Image mapping for products
const getProductImage = (product_name: string, category: string): string => {
  // Default images for each category
  const categoryImages: Record<string, string> = {
    fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300',
    drinks: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&q=80&w=300',
    bakery: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=300',
  };
  
  // Specific product images
  const productImages: Record<string, string> = {
    'apple': 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=300',
    'banana': 'https://images.unsplash.com/photo-1543218024-57a70143c369?auto=format&fit=crop&q=80&w=300',
    'orange': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=300',
    'coca-cola': 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&q=80&w=300',
    'water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=300',
    'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=300',
    'bread': 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=300',
    'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300',
    'muffin': 'https://images.unsplash.com/photo-1599019870892-11e3c43bc015?auto=format&fit=crop&q=80&w=300',
  };
  
  // Check if product_name is defined before using toLowerCase()
  if (!product_name) {
    return categoryImages[category] || 'https://via.placeholder.com/150';
  }
  
  // Find matching product image by checking if product_name contains any keys in productImages
  const matchedKey = Object.keys(productImages).find(key => 
    product_name.toLowerCase().includes(key)
  );
  
  return matchedKey ? productImages[matchedKey] : categoryImages[category] || 'https://via.placeholder.com/150';
};

export async function fetchProducts(category: string = 'all'): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?category=${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map API response to Product type
    return data.map((item: any) => ({
      product_code: item.id.toString(),
      product_name: item.name,
      price: parseFloat(item.price.replace('£', '')),
      stock: item.available,
      category: item.type,
      image: getProductImage(item.name, item.type)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
