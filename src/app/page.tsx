import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`
          }}
          role="img"
          aria-label="Beautiful bedroom interior with natural lighting"
        ></div>

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-48 bg-gradient-to-br from-transparent via-black/10 to-black/30 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-24 h-36 bg-gradient-to-br from-transparent via-black/10 to-black/30 rounded-lg transform -rotate-6"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Flex Living Manager
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Manage your properties, monitor performance, and curate the perfect guest experience with our comprehensive review management platform.
            </p>

            {/* Manager Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="bg-[#4A5D5A] hover:bg-[#3A4D4A] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Access Dashboard
              </Link>
              <Link
                href="/property"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg border border-white/20"
              >
                View Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manager Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4 tracking-tight">Manager Features</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Powerful tools to manage your properties and guest reviews effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl p-8 border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#4A5D5A] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Performance Analytics</h3>
              <p className="text-stone-600 leading-relaxed">
                Monitor property performance, track trends, and identify areas for improvement with comprehensive analytics and insights.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl p-8 border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#4A5D5A] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Review Management</h3>
              <p className="text-stone-600 leading-relaxed">
                Curate and manage guest reviews, approve content for public display, and maintain a positive online reputation.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl p-8 border border-stone-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#4A5D5A] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Property Insights</h3>
              <p className="text-stone-600 leading-relaxed">
                Get detailed insights into each property's performance, guest satisfaction, and review trends to optimize your offerings.
              </p>
            </div>
          </div>

          {/* Quick Access */}
          <div className="text-center mt-16">
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-[#4A5D5A] hover:bg-[#3A4D4A] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
            >
              Go to Manager Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
