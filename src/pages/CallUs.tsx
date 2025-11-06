import { useState } from 'react';
import { Link } from 'react-router-dom';

const CallUs = () => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const phoneNumbers = [
    { number: '+63 910 399 8178', label: 'Primary Hotline', icon: '📱' },
    { number: '+63 935 941 5893', label: 'Secondary Hotline', icon: '☎️' }
  ];

  const copyToClipboard = async (phoneNumber: string) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopiedPhone(phoneNumber);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
    }
  };

  const formatPhoneForCall = (phone: string) => {
    return `tel:${phone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="text-6xl lg:text-7xl mb-6">📞</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-linear-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">Contact Us</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get immediate assistance from our expert technicians
            </p>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Phone Numbers Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Call Our Hotlines
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Need immediate assistance? Our customer service team is ready to help you with any questions or emergency AC repairs.
                </p>
              </div>

              <div className="space-y-4">
                {phoneNumbers.map((phone, index) => (
                  <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                            {phone.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{phone.label}</p>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{phone.number}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={formatPhoneForCall(phone.number)}
                          className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold text-center
                                     hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                                     flex items-center justify-center space-x-2"
                        >
                          <span>📱</span>
                          <span>Call Now</span>
                        </a>
                        
                        <button
                          onClick={() => copyToClipboard(phone.number)}
                          className={`flex-1 border-2 px-6 py-3 rounded-xl font-semibold text-center transition-all duration-300
                                     hover:scale-105 flex items-center justify-center space-x-2 ${
                            copiedPhone === phone.number
                              ? 'border-green-500 text-green-600 bg-green-50'
                              : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <span>{copiedPhone === phone.number ? '✅' : '📋'}</span>
                          <span>{copiedPhone === phone.number ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Hours & Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🕐</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Hours</h3>
                  <div className="w-16 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Monday - Friday</span>
                    <span className="text-blue-600 font-semibold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="text-blue-600 font-semibold">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="text-gray-500 font-semibold">Emergency Only</span>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🚨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Service</h3>
                </div>
                <p className="text-gray-700 text-center leading-relaxed mb-6">
                  AC broke down unexpectedly? We offer 24/7 emergency repairs for urgent situations.
                </p>
                <div className="text-center">
                  <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Additional charges may apply for after-hours service
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Other Ways to Reach Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/booking"
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Online</h3>
                <p className="text-gray-600 mb-4">Book your appointment online at your convenience</p>
                <div className="text-blue-600 font-semibold group-hover:text-cyan-600 transition-colors duration-300">
                  Book Now →
                </div>
              </Link>

              <Link
                to="/about"
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Office</h3>
                <p className="text-gray-600 mb-4">Drop by our location for in-person consultation</p>
                <div className="text-blue-600 font-semibold group-hover:text-cyan-600 transition-colors duration-300">
                  Get Directions →
                </div>
              </Link>

              <Link
                to="/services"
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 sm:col-span-2 lg:col-span-1"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔧</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">View Services</h3>
                <p className="text-gray-600 mb-4">Explore our full range of AC services and pricing</p>
                <div className="text-blue-600 font-semibold group-hover:text-cyan-600 transition-colors duration-300">
                  Learn More →
                </div>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-12 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
                Don't let AC problems affect your comfort. Contact us today for fast, reliable service you can trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+639103998178"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                             flex items-center justify-center space-x-2"
                >
                  <span>📱</span>
                  <span>Call Primary Line</span>
                </a>
                <Link
                  to="/booking"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105
                             flex items-center justify-center space-x-2"
                >
                  <span>📅</span>
                  <span>Schedule Service</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CallUs;