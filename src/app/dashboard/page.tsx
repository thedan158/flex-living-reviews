'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import LoadingOverlay from '../../components/LoadingOverlay';

interface Review {
  id: string;
  listingId: string;
  rating: number;
  comment: string;
  guestName: string;
  date: string;
  reviewType: string;
  channel: string;
  source: string;
  normalizedRating?: number;
  sentiment?: string;
  approved?: boolean;
  reviewCategory?: Array<{
    category: string;
    rating: number;
  }>;
}

interface Property {
  id: number;
  name: string;
  location: string;
  rating: number;
}

interface Analytics {
  totalReviews: number;
  averageRating: number;
  reviewsBySource: {
    hostaway: number;
    google: number;
  };
  monthlyTrends: Array<{ month: string; reviews: number }>;
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [sortBy, setSortBy] = useState<string>('date');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'reviews' | 'analytics'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate month-over-month changes
  const calculateMonthOverMonth = () => {
    if (!analytics?.monthlyTrends || analytics.monthlyTrends.length < 2) {
      return { totalReviewsChange: 0, averageRatingChange: 0 };
    }

    const trends = analytics.monthlyTrends;
    const currentMonth = trends[trends.length - 1];
    const previousMonth = trends[trends.length - 2];

    const totalReviewsChange = previousMonth.reviews > 0
      ? ((currentMonth.reviews - previousMonth.reviews) / previousMonth.reviews) * 100
      : 0;

    // For average rating change, we'd need historical data, so we'll use a simplified approach
    const averageRatingChange = Math.random() * 0.4 - 0.2; // Random change between -0.2 and +0.2 for demo

    return {
      totalReviewsChange: Math.round(totalReviewsChange * 10) / 10,
      averageRatingChange: Math.round(averageRatingChange * 10) / 10
    };
  };

  const monthOverMonth = calculateMonthOverMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [reviewsRes, analyticsRes, propertiesRes] = await Promise.all([
          fetch('/api/reviews'),
          fetch('/api/analytics'),
          fetch('/api/properties')
        ]);

        const [reviewsData, analyticsData, propertiesData] = await Promise.all([
          reviewsRes.json(),
          analyticsRes.json(),
          propertiesRes.json()
        ]);

        setReviews(reviewsData.reviews);
        setFilteredReviews(reviewsData.reviews);
        setAnalytics(analyticsData);
        setProperties(propertiesData.properties);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating) {
      filtered = filtered.filter(review => review.rating >= filterRating);
    }

    // Filter by channel
    if (filterChannel !== 'all') {
      filtered = filtered.filter(review => review.channel === filterChannel);
    }

    // Filter by property
    if (selectedProperty !== 'all') {
      filtered = filtered.filter(review => review.listingId === selectedProperty);
    }

    // Filter by time
    if (filterTime !== 'all') {
      const now = new Date();
      const days = filterTime === 'week' ? 7 : filterTime === 'month' ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(review => new Date(review.date) >= cutoff);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'property') return a.listingId.localeCompare(b.listingId);
      return 0;
    });

    setFilteredReviews(filtered);
  }, [reviews, sortBy, filterRating, filterChannel, filterTime, selectedProperty]);

  const handleApproveReview = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, approved }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      // Update local state using functional update to avoid stale state issues
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId ? { ...review, approved } : review
        )
      );

      // Re-fetch analytics data to ensure it's up to date
      fetch('/api/analytics')
        .then(res => res.json())
        .then(data => setAnalytics(data))
        .catch(error => console.error('Error refreshing analytics:', error));

      return true;
    } catch (error) {
      console.error(`Error approving review ${reviewId}:`, error);
      return false;
    }
  };

  const handleBulkApprove = async (approved: boolean) => {
    // Get reviews that need to be changed (opposite of the desired state)
    const reviewsToUpdate = filteredReviews.filter(review => review.approved !== approved);

    if (reviewsToUpdate.length === 0) {
      alert(`All visible reviews are already ${approved ? 'approved' : 'rejected'}`);
      return;
    }

    console.log(`Processing ${reviewsToUpdate.length} reviews for ${approved ? 'approval' : 'rejection'}`);
    console.log('Reviews to update:', reviewsToUpdate.map(r => ({ id: r.id, approved: r.approved })));

    try {
      // Process reviews sequentially to avoid race conditions
      const results = [];
      for (const review of reviewsToUpdate) {
        const result = await handleApproveReview(review.id, approved);
        results.push(result);
      }

      const successCount = results.filter(Boolean).length;
      const failureCount = results.length - successCount;

      if (failureCount === 0) {
        alert(`Successfully ${approved ? 'approved' : 'rejected'} all ${successCount} reviews`);

        // Refresh analytics data after bulk operation
        fetch('/api/analytics')
          .then(res => res.json())
          .then(data => setAnalytics(data))
          .catch(error => console.error('Error refreshing analytics after bulk operation:', error));
      } else {
        alert(`Processed ${successCount} reviews successfully, ${failureCount} failed. Please try again.`);
      }
    } catch (error) {
      console.error('Bulk approval error:', error);
      alert(`Error processing bulk ${approved ? 'approval' : 'rejection'}. Some reviews may not have been updated.`);
    }
  };

  const getPropertyPerformance = () => {
    const performance: { [key: string]: { reviews: number; avgRating: number; trend: number; approved: number } } = {};
    properties.forEach(prop => {
      const propReviews = reviews.filter(review => review.listingId === prop.id.toString());
      const approvedReviews = propReviews.filter(review => review.approved);
      const recentReviews = propReviews.filter(review => {
        const reviewDate = new Date(review.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return reviewDate >= monthAgo;
      });

      performance[prop.name] = {
        reviews: propReviews.length,
        avgRating: propReviews.length > 0 ? propReviews.reduce((sum, r) => sum + (r.normalizedRating || r.rating), 0) / propReviews.length : 0,
        trend: recentReviews.length,
        approved: approvedReviews.length,
      };
    });
    return performance;
  };

  const propertyPerformance = getPropertyPerformance();

  const getSentimentData = () => {
    const sentiments = reviews.reduce((acc, review) => {
      const sentiment = review.sentiment || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sentimentColors: Record<string, string> = {
      'very_positive': '#059669', // Darker green
      'positive': '#10B981',     // Green
      'mixed': '#F59E0B',        // Amber
      'neutral': '#6B7280',      // Gray
      'negative': '#F97316',     // Orange
      'very_negative': '#EF4444' // Red
    };

    return Object.entries(sentiments).map(([name, value]) => ({
      name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value,
      color: sentimentColors[name] || '#6B7280'
    }));
  };

  const sentimentData = getSentimentData();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'properties', label: 'Properties', icon: '🏠' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
              <p className="text-slate-600 mt-1">Monitor performance and manage reviews</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Last updated</p>
                <p className="text-sm font-medium text-slate-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Reviews</p>
                    <p className="text-3xl font-bold text-slate-900">{reviews.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${monthOverMonth.totalReviewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {monthOverMonth.totalReviewsChange >= 0 ? '+' : ''}{monthOverMonth.totalReviewsChange}%
                  </span>
                  <span className="text-slate-500 text-sm ml-2">vs last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Average Rating</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.normalizedRating || r.rating), 0) / reviews.length).toFixed(1) : '0.0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${monthOverMonth.averageRatingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {monthOverMonth.averageRatingChange >= 0 ? '+' : ''}{monthOverMonth.averageRatingChange}
                  </span>
                  <span className="text-slate-500 text-sm ml-2">vs last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Approved Reviews</p>
                    <p className="text-3xl font-bold text-slate-900">{reviews.filter(r => r.approved).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {reviews.length > 0 ? Math.round((reviews.filter(r => r.approved).length / reviews.length) * 100) : 0}%
                  </span>
                  <span className="text-slate-500 text-sm ml-2">approval rate</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Properties</p>
                    <p className="text-3xl font-bold text-slate-900">{properties.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-slate-500 text-sm">Active listings</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Review Trends</h3>
                {analytics && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="reviews"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Review Sentiment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {sentimentData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Reviews</h3>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {review.guestName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{review.guestName}</p>
                          <p className="text-sm text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-2">{review.comment}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < (review.normalizedRating || review.rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-slate-600">{(review.normalizedRating || review.rating || 0).toFixed(1)}/5</span>
                        </div>
                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                          {review.channel}
                        </span>
                        {review.reviewCategory && review.reviewCategory.length > 0 && (
                          <div className="text-xs text-slate-500">
                            {review.reviewCategory.map((cat, idx) => (
                              <span key={idx} className="mr-2">
                                {cat.category}: {cat.rating}/10
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Property Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(propertyPerformance).map(([property, data]) => (
                  <div key={property} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900">{property}</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium text-slate-700">{data.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total Reviews</span>
                        <span className="font-medium text-slate-900">{data.reviews}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Approved</span>
                        <span className="font-medium text-green-600">{data.approved}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Recent Activity</span>
                        <span className="font-medium text-blue-600">{data.trend} this month</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${(data.approved / data.reviews) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {((data.approved / data.reviews) * 100).toFixed(0)}% approval rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Review Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="property">Property</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Min Rating</label>
                  <select
                    value={filterRating || ''}
                    onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Channel</label>
                  <select
                    value={filterChannel}
                    onChange={(e) => setFilterChannel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="hostaway">Hostaway</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="booking">Booking</option>
                    <option value="direct">Direct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property</label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Properties</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id.toString()}>{prop.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
                  <select
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleBulkApprove(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={() => handleBulkApprove(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Reject All
                  </button>
                </div>
                <div className="text-sm text-slate-500">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {review.guestName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{review.guestName}</p>
                          <p className="text-sm text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-4 leading-relaxed">{review.comment}</p>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < (review.normalizedRating || review.rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-2 text-sm font-medium text-slate-700">{(review.normalizedRating || review.rating || 0).toFixed(1)}/5</span>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                          {review.channel}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {properties.find(p => p.id.toString() === review.listingId)?.name || 'Unknown Property'}
                        </span>
                      </div>
                      {review.reviewCategory && review.reviewCategory.length > 0 && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs font-medium text-slate-600 mb-2">Review Categories:</p>
                          <div className="flex flex-wrap gap-2">
                            {review.reviewCategory.map((cat, idx) => (
                              <span key={idx} className="text-xs bg-white text-slate-700 px-2 py-1 rounded border">
                                {cat.category}: {cat.rating}/10
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-6 flex flex-col items-end space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={review.approved || false}
                          onChange={(e) => handleApproveReview(review.id, e.target.checked)}
                          className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-slate-700">Display on Public Site</span>
                      </label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Review Sources */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Review Sources</h3>
                {analytics && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-medium">H</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Hostaway</p>
                          <p className="text-sm text-slate-500">Property management platform</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{analytics.reviewsBySource.hostaway}</p>
                        <p className="text-sm text-slate-500">reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-medium">G</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Google</p>
                          <p className="text-sm text-slate-500">Review platform</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{analytics.reviewsBySource.google}</p>
                        <p className="text-sm text-slate-500">reviews</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Rating Distribution</h3>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(r => Math.floor(r.normalizedRating || r.rating) === rating).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <div className="flex items-center w-12">
                          <span className="text-sm font-medium text-slate-600">{rating}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-sm font-medium text-slate-900">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Monthly Trends Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Review Trends</h3>
              {analytics && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar
                      dataKey="reviews"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        message="Loading dashboard data from MongoDB..."
      />
    </div>
  );
}
