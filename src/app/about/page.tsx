import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-stone-50 via-white to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-6 tracking-tight">
              About Flex Living
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing the way people experience short-term rentals by connecting discerning travelers with exceptional properties worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-6">Our Mission</h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                At Flex Living, we believe that every stay should be more than just a place to sleep.
                Our mission is to curate exceptional properties that offer not just comfort, but memorable experiences
                that enrich our guests' lives.
              </p>
              <p className="text-stone-600 leading-relaxed mb-8">
                We work directly with property owners to ensure every listing meets our high standards for quality,
                cleanliness, and unique character. Our platform makes it easy to discover and book these special places.
              </p>
              <Link
                href="/"
                className="bg-[#4A5D5A] hover:bg-[#3A4D4A] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Explore Properties
              </Link>
            </div>
            <div className="bg-stone-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5D5A] mb-2">500+</div>
                  <div className="text-stone-600">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5D5A] mb-2">10K+</div>
                  <div className="text-stone-600">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5D5A] mb-2">50+</div>
                  <div className="text-stone-600">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#4A5D5A] mb-2">4.8★</div>
                  <div className="text-stone-600">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
