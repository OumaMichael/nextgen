'use client';

import { useState, useEffect } from 'react';
import { restaurants, tables, owners } from '@/lib/data';
import { useRouter } from 'next/navigation';

export default function OwnerDashboard() {
  const [selectedOwnerId] = useState('1'); // Simulating logged in owner
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  
  const owner = owners.find(o => o.id === selectedOwnerId);
  const restaurant = restaurants.find(r => r.id === owner?.restaurantId);
  const ownerTables = tables.filter(t => t.ownerId === selectedOwnerId);
  const popularDishes = restaurant?.dishes.filter(d => d.isPopular) || [];

  useEffect(() => {
    // Check authentication state
    const storedUserType = localStorage.getItem('userType');
    const storedUserName = localStorage.getItem('userName');
    
    if (!storedUserType) {
      router.push('/login');
      return;
    }
    
    setUserType(storedUserType);
    setUserName(storedUserName);
    
    // Dispatch auth change event to update navbar
    window.dispatchEvent(new Event('authChange'));
  }, [router]);

  if (!owner || !restaurant || !userType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Welcome back, {userName?.split(' ')[0] || owner.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Managing {restaurant.name} - {restaurant.cuisine} Cuisine
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Owner Dashboard</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{restaurant.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              KSh {owner.totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Tables Owned</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{ownerTables.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {ownerTables.filter(t => t.status === 'available').length} available
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Popular Dishes</h3>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{popularDishes.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top performing items</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tables Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Tables</h2>
            <div className="grid grid-cols-4 gap-3">
              {ownerTables.map((table) => (
                <div
                  key={table.id}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                    table.status === 'available'
                      ? 'bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600'
                      : 'bg-red-500 dark:bg-red-600 text-white border-red-500 dark:border-red-600'
                  }`}
                >
                  T{table.number}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Reserved</span>
              </div>
            </div>
          </div>

          {/* Popular Dishes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Popular Dishes</h2>
            <div className="space-y-4">
              {popularDishes.map((dish) => (
                <div key={dish.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">{dish.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dish.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      KSh {dish.price.toLocaleString()}
                    </p>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant Menu */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Menu</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant.dishes.map((dish) => (
              <div key={dish.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{dish.name}</h4>
                  {dish.isPopular && (
                    <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{dish.description}</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  KSh {dish.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Add New Dish
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Update Prices
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View Orders
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}