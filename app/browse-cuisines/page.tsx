'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { restaurants, cuisines } from '@/lib/data';

export default function BrowseCuisines() {
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCuisine = selectedCuisine === '' || restaurant.cuisine === selectedCuisine;
    const matchesSearch = searchTerm === '' || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCuisine && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Browse by Cuisine</h1>
        <p className="text-gray-600 mb-6">
          Find restaurants by cuisine type or search by name
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine.name} value={cuisine.name}>
                {cuisine.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cuisine Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.name}
              onClick={() => setSelectedCuisine(selectedCuisine === cuisine.name ? '' : cuisine.name)}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                selectedCuisine === cuisine.name ? 'ring-2 ring-amber-500' : ''
              }`}
            >
              <div className="relative h-24 w-full">
                <Image
                  src={cuisine.image}
                  alt={cuisine.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium text-gray-800 text-center">
                  {cuisine.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {restaurant.name}
              </h3>
              <p className="text-sm text-amber-600 font-medium mb-2">
                {restaurant.cuisine}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {restaurant.description}
              </p>
              <Link 
                href={`/order?outlet=${restaurant.id}`}
                className="w-full bg-amber-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors block text-center"
              >
                Order Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}