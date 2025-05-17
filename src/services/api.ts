
import { Product } from '../context/CartContext';

const API_BASE_URL = 'https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s';

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
      image: item.img, // Use the image URL directly from the API
      id: item.id,
      description: item.description,
      rating: item.rating
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
