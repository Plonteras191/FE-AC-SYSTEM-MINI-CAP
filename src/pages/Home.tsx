import { Link } from 'react-router-dom';
import heroImage from '../assets/heroimg.jpg';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-blue-100 text-sm font-medium">Available for Home Service Today</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
              Expert Aircon <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Cleaning & Repair
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              Professional NC2/NC3 certified technicians delivering premium air conditioning services.
              Trusted by 1000+ households in Cagayan de Oro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
              >
                Book Appointment
                <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/20 hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-white/40"
              >
                View Services
              </Link>
            </div>

            {/* Stats Badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-700/50">
              <div>
                <p className="text-3xl font-bold text-white">10+</p>
                <p className="text-sm text-gray-400">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">1k+</p>
                <p className="text-sm text-gray-400">Happy Clients</p>
              </div>
              <div className="hidden md:block">
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-gray-400">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-bold text-blue-600 uppercase tracking-wide">Why Choose Us</h2>
            <h3 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              The Standard for AC Excellence
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              We don't just fix ACs; we restore comfort to your home with unmatched professionalism and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">👨‍🔧</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Certified Experts</h4>
              <p className="text-gray-600 leading-relaxed">
                Our team consists of strictly TESDA NC2/NC3 certified technicians.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏷️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fair Pricing</h4>
              <p className="text-gray-600 leading-relaxed">
                Transparent quotes with no hidden fees or surprise charges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fast Service</h4>
              <p className="text-gray-600 leading-relaxed">
                Quick response times and efficient service to minimize downtime.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Guaranteed</h4>
              <p className="text-gray-600 leading-relaxed">
                30-day service warranty on repairs for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-base font-bold text-blue-600 uppercase tracking-wide">Our Services</h2>
              <h3 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Comprehensive Cooling Solutions
              </h3>
            </div>
            <Link to="/services" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 group">
              View All Services
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'General Cleaning', icon: '❄️', desc: 'Thorough cleaning of indoor and outdoor units to improve efficiency.' },
              { title: 'Repair Service', icon: '🔧', desc: 'Diagnosis and repair of all AC problems, from leaks to motor issues.' },
              { title: 'Installation', icon: '🏗️', desc: 'Professional mounting and setup of new air conditioning units.' },
              { title: 'Maintenance', icon: '📋', desc: 'Regular check-ups to prevent breakdowns and extend unit lifespan.' }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
                  {service.icon}
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-gray-600 mb-4 text-sm">{service.desc}</p>
                  <Link to="/booking" className="block text-center w-full py-2 px-4 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Maria Santos", role: "Homeowner", text: "Excellent service! The technicians were punctual and very polite. My AC is cooling perfectly now." },
              { name: "James Reyes", role: "Business Owner", text: "Highly recommended for commercial spaces. They fixed our office AC in no time. Very professional." },
              { name: "Sarah Lee", role: "Resident", text: "Fair pricing and transparent service. I appreciate that they explained what was wrong before fixing it." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl relative">
                <div className="text-blue-200 text-6xl absolute top-4 left-6 font-serif">"</div>
                <p className="text-gray-600 relative z-10 mb-6 pt-6">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-yellow-400 mt-4">
                  {'⭐'.repeat(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Serving Cagayan de Oro & Surrounding Areas</h2>
          <p className="text-blue-100 text-lg mb-8">
            We bring expert aircon services right to your doorstep. From Uptown to Downtown, we've got you covered.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              to="/booking"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Book a Service
            </Link>
            <Link
              to="/call-us"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;