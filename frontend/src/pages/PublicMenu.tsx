import React, { useEffect, useState } from 'react';
import { Empty } from '../proto';
import menuClient from '../services/menuClient';

interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  order: number;
}

interface CategoryWithDishes {
  categoryInfo: Category;
  dishes: Dish[];
}

const PublicMenu: React.FC = () => {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const request = new Empty();
      
      menuClient.getFullMenu(request, {}, (err, response) => {
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        
        if (response) {
          const info = response.getRestaurantInfo();
          if (info) {
            setRestaurantInfo({
              name: info.getName(),
              address: info.getAddress(),
              phone: info.getPhone(),
            });
          }

          const cats = response.getCategoriesList().map(cat => {
            const catInfo = cat.getCategoryInfo();
            return {
              categoryInfo: {
                id: catInfo?.getId() || 0,
                name: catInfo?.getName() || '',
                order: catInfo?.getOrder() || 0,
              },
              dishes: cat.getDishesList().map(dish => ({
                id: dish.getId(),
                name: dish.getName(),
                description: dish.getDescription(),
                price: dish.getPrice(),
                isAvailable: dish.getIsAvailable(),
                categoryId: dish.getCategoryId(),
              })),
            };
          });
          setCategories(cats);
        }
        setLoading(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{restaurantInfo?.name}</h1>
          <p className="text-lg opacity-90">{restaurantInfo?.address}</p>
          <p className="text-lg opacity-90">{restaurantInfo?.phone}</p>
          <div className="mt-4">
            <a
              href="/admin"
              className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Admin Panel
            </a>
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {categories.map((category) => (
            <div key={category.categoryInfo.id} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-600 pb-2">
                {category.categoryInfo.name}
              </h2>
              <div className="space-y-4">
                {category.dishes.length === 0 ? (
                  <p className="text-gray-500 italic">No dishes available in this category.</p>
                ) : (
                  category.dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {dish.name}
                          </h3>
                          <p className="text-gray-600">{dish.description}</p>
                        </div>
                        <div className="ml-4">
                          <span className="text-2xl font-bold text-blue-600">
                            ${dish.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {restaurantInfo?.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;
