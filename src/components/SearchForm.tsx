'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [city, setCity] = useState('Bangkok');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const router = useRouter();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }

    if (!checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }

    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }

    if (guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create search query parameters
      const searchParams = new URLSearchParams({
        city,
        checkIn,
        checkOut,
        guests: guests.toString()
      });

      // Navigate to search results page (we'll create this)
      router.push(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('Search failed:', error);
      setErrors({ general: 'Search failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementGuests = () => setGuests(prev => prev + 1);
  const decrementGuests = () => setGuests(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="search-container bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto border border-white/20">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* City Dropdown */}
        <div className="md:col-span-1">
          <label htmlFor="city" className="block text-sm font-medium text-text-dark mb-2">
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input w-full bg-light-gray focus:ring-2 focus:ring-primary-teal focus:border-transparent"
            aria-label="Select city"
          >
            <option value="Bangkok">Bangkok</option>
            <option value="London">London</option>
            <option value="Paris">Paris</option>
            <option value="Algiers">Algiers</option>
          </select>
        </div>

        {/* Check-in Date */}
        <div className="md:col-span-1">
          <label htmlFor="checkin" className="block text-sm font-medium text-text-dark mb-2">
            Check-in
          </label>
          <div className="relative">
            <input
              type="date"
              id="checkin"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="form-input w-full bg-light-gray focus:ring-2 focus:ring-primary-teal focus:border-transparent"
              aria-label="Select check-in date"
              aria-describedby="checkin-help"
            />
            <div id="checkin-help" className="sr-only">
              Select your check-in date
            </div>
          </div>
        </div>

        {/* Check-out Date */}
        <div className="md:col-span-1">
          <label htmlFor="checkout" className="block text-sm font-medium text-text-dark mb-2">
            Check-out
          </label>
          <div className="relative">
            <input
              type="date"
              id="checkout"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="form-input w-full bg-light-gray focus:ring-2 focus:ring-primary-teal focus:border-transparent"
              aria-label="Select check-out date"
              aria-describedby="checkout-help"
            />
            <div id="checkout-help" className="sr-only">
              Select your check-out date
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="md:col-span-1">
          <label htmlFor="guests" className="block text-sm font-medium text-text-dark mb-2">
            Guests
          </label>
          <div className="flex items-center bg-light-gray rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={decrementGuests}
              className="p-3 text-text-dark hover:text-primary-teal transition-colors"
              aria-label="Decrease number of guests"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="flex-1 text-center text-text-dark font-medium" id="guests-count">
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
            <button
              type="button"
              onClick={incrementGuests}
              className="p-3 text-text-dark hover:text-primary-teal transition-colors"
              aria-label="Increase number of guests"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-4 flex justify-center mt-4">
          <button
            type="submit"
            className="search-button flex items-center justify-center space-x-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            aria-label="Search for properties"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
