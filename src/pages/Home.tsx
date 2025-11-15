import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
    {/* Hero Section */}
    <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="block">CDOC EER Aircon</span>
              <span className="block bg-linear-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Cleaning & Repair
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mt-2 text-blue-100">
                Home Service
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Professional Services • NC2/NC3 Certified Technicians • 10+ Years Experience
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link 
              to="/booking" 
              className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg 
                         hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl
                         border-2 border-transparent hover:border-blue-200 min-w-[200px]"
            >
              <span className="relative z-10">Schedule Now</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/services" 
              className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl 
                         font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300
                         hover:scale-105 shadow-lg hover:shadow-xl min-w-[200px]"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 fill-current text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Our Service?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our professional aircon services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="group bg-white p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-2xl 
                          transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div className="text-6xl lg:text-7xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
              ❄️
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-center text-gray-900">
              Fast Response
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Quick and reliable professional services when you need them most
            </p>
            <div className="mt-6 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full 
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
          
          <div className="group bg-white p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-2xl 
                          transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div className="text-6xl lg:text-7xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
              🔧
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-center text-gray-900">
              Expert Technicians
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              NC2/NC3-certified professionals with over 10 years of experience
            </p>
            <div className="mt-6 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full 
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
          
          <div className="group bg-white p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-2xl 
                          transition-all duration-500 hover:-translate-y-2 border border-gray-100 
                          md:col-span-2 lg:col-span-1">
            <div className="text-6xl lg:text-7xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
              ₱
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-center text-gray-900">
              Transparent Pricing
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Upfront pricing with no hidden fees - know exactly what you'll pay
            </p>
            <div className="mt-6 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full 
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 
                        rounded-3xl shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>
          <div className="relative text-center py-16 px-8 space-y-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Stay Cool?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Don't let a broken AC ruin your comfort. Contact us now for all your air conditioning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link 
                to="/booking" 
                className="group relative bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg 
                           hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl
                           border-2 border-transparent hover:border-blue-200 min-w-[220px]"
              >
                <span className="relative z-10">Book Appointment</span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/call-us" 
                className="group bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl 
                           font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300
                           hover:scale-105 shadow-lg hover:shadow-xl min-w-[220px]"
              >
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer Section */}
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                CDOC EER Aircon
              </h3>
              <p className="text-lg text-cyan-400 font-semibold mb-4">
                Cleaning & Repair Home Service
              </p>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Professional air conditioning services with over 10 years of experience. 
                Our NC2/NC3 certified technicians provide reliable, efficient, and 
                affordable solutions for all your cooling needs.
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <span className="text-xl mr-3">📞</span>
                <span>+63 910 399 8178</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-xl mr-3">📧</span>
                <span>eeracservice@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="text-xl mr-3">📍</span>
                <span>Cagayan De Oro City, Philippines</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/booking" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  Book Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/call-us" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Our Services</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">•</span>
                AC Cleaning
              </li>
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">•</span>
                AC Repair
              </li>
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">•</span>
                AC Installation
              </li>
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">•</span>
                AC Maintenance
              </li>
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">•</span>
                Emergency Service
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2024 CDOC EER Aircon Cleaning & Repair. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <span className="text-xl">📘</span>
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <span className="text-xl">📷</span>
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                  aria-label="WhatsApp"
                >
                  <span className="text-xl">💬</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default Home;