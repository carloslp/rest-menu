import React, { useEffect, useState } from 'react';
import {
  Empty,
  RestaurantInfo as ProtoRestaurantInfo,
  Category as ProtoCategory,
  Dish as ProtoDish,
  CategoryID,
  DishID,
} from '../proto/menu_pb';
import menuClient from '../services/menuClient';

interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
}

interface Category {
  id: number;
  name: string;
  order: number;
}

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  categoryId: number;
}

const AdminPanel: React.FC = () => {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: '',
    address: '',
    phone: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'restaurant' | 'categories' | 'dishes'>('restaurant');

  // Form states
  const [categoryForm, setCategoryForm] = useState({ id: 0, name: '', order: 0 });
  const [dishForm, setDishForm] = useState({
    id: 0,
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    categoryId: 0,
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategoryId > 0) {
      fetchDishesByCategory(selectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchRestaurantInfo(), fetchCategories()]);
    setLoading(false);
  };

  const fetchRestaurantInfo = () => {
    return new Promise<void>((resolve) => {
      const request = new Empty();
      menuClient.getRestaurantInfo(request, {}, (err, response) => {
        if (!err && response) {
          setRestaurantInfo({
            name: response.getName(),
            address: response.getAddress(),
            phone: response.getPhone(),
          });
        }
        resolve();
      });
    });
  };

  const fetchCategories = () => {
    return new Promise<void>((resolve) => {
      const request = new Empty();
      menuClient.listCategories(request, {}, (err, response) => {
        if (!err && response) {
          const cats = response.getCategoriesList().map((cat) => ({
            id: cat.getId(),
            name: cat.getName(),
            order: cat.getOrder(),
          }));
          setCategories(cats);
          if (cats.length > 0 && selectedCategoryId === 0) {
            setSelectedCategoryId(cats[0].id);
          }
        }
        resolve();
      });
    });
  };

  const fetchDishesByCategory = (categoryId: number) => {
    const request = new CategoryID();
    request.setId(categoryId);
    menuClient.listDishesByCategory(request, {}, (err, response) => {
      if (!err && response) {
        const dishesList = response.getDishesList().map((dish) => ({
          id: dish.getId(),
          name: dish.getName(),
          description: dish.getDescription(),
          price: dish.getPrice(),
          isAvailable: dish.getIsAvailable(),
          categoryId: dish.getCategoryId(),
        }));
        setDishes(dishesList);
      }
    });
  };

  const handleUpdateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const request = new ProtoRestaurantInfo();
    request.setName(restaurantInfo.name);
    request.setAddress(restaurantInfo.address);
    request.setPhone(restaurantInfo.phone);

    menuClient.updateRestaurantInfo(request, {}, (err, response) => {
      if (!err && response) {
        alert('Restaurant info updated successfully!');
      } else {
        alert('Failed to update restaurant info');
      }
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const request = new ProtoCategory();
    request.setName(categoryForm.name);
    request.setOrder(categoryForm.order);

    menuClient.createCategory(request, {}, (err, response) => {
      if (!err && response) {
        alert('Category created successfully!');
        setCategoryForm({ id: 0, name: '', order: 0 });
        fetchCategories();
      } else {
        alert('Failed to create category');
      }
    });
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const request = new ProtoCategory();
    request.setId(categoryForm.id);
    request.setName(categoryForm.name);
    request.setOrder(categoryForm.order);

    menuClient.updateCategory(request, {}, (err, response) => {
      if (!err && response) {
        alert('Category updated successfully!');
        setCategoryForm({ id: 0, name: '', order: 0 });
        fetchCategories();
      } else {
        alert('Failed to update category');
      }
    });
  };

  const handleDeleteCategory = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    const request = new CategoryID();
    request.setId(id);

    menuClient.deleteCategory(request, {}, (err) => {
      if (!err) {
        alert('Category deleted successfully!');
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    });
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    const request = new ProtoDish();
    request.setName(dishForm.name);
    request.setDescription(dishForm.description);
    request.setPrice(dishForm.price);
    request.setIsAvailable(dishForm.isAvailable);
    request.setCategoryId(dishForm.categoryId || selectedCategoryId);

    menuClient.createDish(request, {}, (err, response) => {
      if (!err && response) {
        alert('Dish created successfully!');
        setDishForm({
          id: 0,
          name: '',
          description: '',
          price: 0,
          isAvailable: true,
          categoryId: 0,
        });
        fetchDishesByCategory(dishForm.categoryId || selectedCategoryId);
      } else {
        alert('Failed to create dish');
      }
    });
  };

  const handleUpdateDish = (e: React.FormEvent) => {
    e.preventDefault();
    const request = new ProtoDish();
    request.setId(dishForm.id);
    request.setName(dishForm.name);
    request.setDescription(dishForm.description);
    request.setPrice(dishForm.price);
    request.setIsAvailable(dishForm.isAvailable);
    request.setCategoryId(dishForm.categoryId);

    menuClient.updateDish(request, {}, (err, response) => {
      if (!err && response) {
        alert('Dish updated successfully!');
        setDishForm({
          id: 0,
          name: '',
          description: '',
          price: 0,
          isAvailable: true,
          categoryId: 0,
        });
        fetchDishesByCategory(dishForm.categoryId);
      } else {
        alert('Failed to update dish');
      }
    });
  };

  const handleDeleteDish = (id: number, categoryId: number) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;

    const request = new DishID();
    request.setId(id);

    menuClient.deleteDish(request, {}, (err) => {
      if (!err) {
        alert('Dish deleted successfully!');
        fetchDishesByCategory(categoryId);
      } else {
        alert('Failed to delete dish');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <a href="/" className="text-white hover:text-green-100 underline">
            ← Back to Public Menu
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setActiveTab('restaurant')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'restaurant'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Restaurant Info
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'categories'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'dishes'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Dishes
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Restaurant Info Tab */}
        {activeTab === 'restaurant' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Restaurant Information</h2>
            <form onSubmit={handleUpdateRestaurant} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  value={restaurantInfo.address}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="text"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Update Restaurant Info
              </button>
            </form>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {categoryForm.id ? 'Edit Category' : 'Create Category'}
              </h2>
              <form
                onSubmit={categoryForm.id ? handleUpdateCategory : handleCreateCategory}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Order</label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    {categoryForm.id ? 'Update' : 'Create'} Category
                  </button>
                  {categoryForm.id && (
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ id: 0, name: '', order: 0 })}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">All Categories</h2>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{cat.name}</h3>
                      <p className="text-sm text-gray-600">Order: {cat.order}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCategoryForm(cat)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dishes Tab */}
        {activeTab === 'dishes' && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Select Category</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">{dishForm.id ? 'Edit Dish' : 'Create Dish'}</h2>
                <form
                  onSubmit={dishForm.id ? handleUpdateDish : handleCreateDish}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={dishForm.name}
                      onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      value={dishForm.description}
                      onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dishForm.price}
                      onChange={(e) => setDishForm({ ...dishForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={dishForm.categoryId || selectedCategoryId}
                      onChange={(e) =>
                        setDishForm({ ...dishForm, categoryId: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dishForm.isAvailable}
                        onChange={(e) => setDishForm({ ...dishForm, isAvailable: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-gray-700 font-semibold">Available</span>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      {dishForm.id ? 'Update' : 'Create'} Dish
                    </button>
                    {dishForm.id && (
                      <button
                        type="button"
                        onClick={() =>
                          setDishForm({
                            id: 0,
                            name: '',
                            description: '',
                            price: 0,
                            isAvailable: true,
                            categoryId: 0,
                          })
                        }
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Dishes in Category</h2>
                <div className="space-y-3">
                  {dishes.map((dish) => (
                    <div key={dish.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{dish.name}</h3>
                          <p className="text-sm text-gray-600">{dish.description}</p>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            ${dish.price.toFixed(2)}
                          </p>
                          <p className="text-sm">
                            {dish.isAvailable ? (
                              <span className="text-green-600">Available</span>
                            ) : (
                              <span className="text-red-600">Not Available</span>
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setDishForm(dish)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish.id, dish.categoryId)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
