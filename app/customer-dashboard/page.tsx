'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Calendar, Star, Clock, MapPin } from 'lucide-react';

interface Order {
  id: string;
  restaurantName: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  date: string;
}

interface Reservation {
  id: string;
  tableNumber: number;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'cancelled';
}

export default function CustomerDashboard() {
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [orders] = useState<Order[]>([
    {
      id: '1',
      restaurantName: 'Tamu Tamu Grills',
      items: ['Grilled Chicken', 'Beef Kebabs'],
      total: 2700,
      status: 'preparing',
      date: '2024-01-15'
    },
    {
      id: '2',
      restaurantName: 'Swahili Plates',
      items: ['Chicken Biryani', 'Coconut Rice'],
      total: 1600,
      status: 'completed',
      date: '2024-01-14'
    }
  ]);
  
  const [reservations] = useState<Reservation[]>([
    {
      id: '1',
      tableNumber: 5,
      date: '2024-01-16',
      time: '18:00',
      guests: 4,
      status: 'confirmed'
    }
  ]);

  const router = useRouter();

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

  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'preparing':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'ready':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Welcome back, {userName?.split(' ')[0] || 'Customer'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Your food court experience dashboard
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Customer Dashboard</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">FoodCourt Hub</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <ShoppingBag className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Total Orders</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Reservations</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Favorite Cuisine</h3>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">BBQ</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Active Orders</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {orders.filter(o => o.status === 'preparing' || o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Recent Orders</h2>
              <Link 
                href="/order" 
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold"
              >
                Place New Order
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">{order.restaurantName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.items.join(', ')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      KSh {order.total.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Reservations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Reservations</h2>
              <Link 
                href="/reservations" 
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold"
              >
                Make Reservation
              </Link>
            </div>
            
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          Table {reservation.tableNumber}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {reservation.guests} guests
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link 
              href="/order"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Order Food
            </Link>
            <Link 
              href="/reservations"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Reserve Table
            </Link>
            <Link 
              href="/browse-cuisines"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Browse Menu
            </Link>
            <Link 
              href="/reviews"
              className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-4 rounded-lg font-medium hover:from-purple-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Write Review
            </Link>
          </div>
        </div>

        {/* Favorite Restaurants */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Your Favorite Restaurants</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tamu Tamu Grills</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">BBQ Cuisine</p>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">4.8 (12 orders)</span>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Swahili Plates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Coastal Cuisine</p>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">4.6 (8 orders)</span>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Sushi Spot</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Japanese Cuisine</p>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">4.9 (5 orders)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}