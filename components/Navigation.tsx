'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Moon, Sun } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/browse-cuisines', label: 'Cuisines' },
    { href: '/order', label: 'Orders' },
    { href: '/reservations', label: 'Reservations' },
  ];

  useEffect(() => {
    // Check if user is logged in as owner (only runs on client-side)
    const userType = localStorage.getItem('userType');
    setIsOwnerLoggedIn(userType === 'owner');
    
    // Load cart count
    const savedCart = localStorage.getItem('foodCourtCart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalItems);
    }
    
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Listen for cart updates
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('foodCourtCart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NextGen Mall Food Court
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg font-semibold transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-105 ${
                  pathname === item.href 
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Cart Icon */}
            <Link
              href="/checkout"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            
            {isOwnerLoggedIn && (
              <Link
                href="/owner-dashboard"
                className={`text-lg font-semibold transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-105 ${
                  pathname === '/owner-dashboard' 
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart */}
            <Link
              href="/checkout"
              className="relative p-2 text-gray-700 dark:text-gray-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <select
              onChange={(e) => window.location.href = e.target.value}
              value={pathname}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {navItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
              {isOwnerLoggedIn && (
                <option value="/owner-dashboard">Dashboard</option>
              )}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}