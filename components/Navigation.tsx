'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/browse-outlets', label: 'Outlets' },
    { href: '/browse-cuisines', label: 'Cuisines' },
    { href: '/popular-dishes', label: 'Popular' },
    { href: '/order', label: 'Order' },
    { href: '/reservations', label: 'Tables' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/checkout', label: 'Checkout' },
    { href: '/login', label: 'Login' },
  ];

  // Only show owner dashboard if user is logged in as owner
  const showOwnerDashboard = () => {
    // Check if user is logged in as owner (you can implement proper auth later)
    const isOwner = localStorage.getItem('userType') === 'owner';
    return isOwner;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            NextGen Mall Food Court
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  pathname === item.href ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {showOwnerDashboard() && (
              <Link
                href="/owner-dashboard"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === '/owner-dashboard' ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                Owner Dashboard
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <select
              onChange={(e) => window.location.href = e.target.value}
              value={pathname}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              {navItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
              {showOwnerDashboard() && (
                <option value="/owner-dashboard">Owner Dashboard</option>
              )}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}