import { Link } from 'react-router-dom';
import myImage from "../assets/map.jpg";

const About = () => {
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              About <span className="bg-linear-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">Our Story</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in air conditioning solutions for over a decade
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
        <div className="max-w-7xl mx-auto">
          {/* Company Story */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <div className="text-center mb-12">
                <div className="text-6xl mb-6">❄️</div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  EER Aircon Services
                </h2>
                <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p className="text-xl leading-relaxed">
                  Welcome to <span className="font-semibold text-blue-600">EER Aircon Services</span> – your trusted partner in air conditioning solutions. We are dedicated to providing high-quality and reliable cooling services to both homes and businesses in our community, ensuring your comfort is always our top priority.
                </p>
                
                <p className="leading-relaxed">
                  With a commitment to excellence and customer satisfaction, we specialize in air conditioning installation, maintenance, repairs, and now offer convenient home service, delivering expert care right to your doorstep.
                </p>
                
                <p className="leading-relaxed">
                  Our team of skilled professionals is equipped with the expertise and experience to handle all types of air conditioning systems, ensuring optimal performance and energy efficiency for your complete peace of mind.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Us?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Discover what makes us the preferred choice for AC services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">🏆</div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-900">10+ Years Experience</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Over a decade of trusted service in the air conditioning industry
                </p>
                <div className="mt-6 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">🏠</div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-900">Home Service</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Convenient at-home service delivery for your comfort and safety
                </p>
                <div className="mt-6 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 md:col-span-2 lg:col-span-1">
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">🎖️</div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-900">NC2/NC3 Certified</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Professionally certified technicians ensuring quality service
                </p>
                <div className="mt-6 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="lg:flex">
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="flex items-center mb-8">
                  <div className="text-4xl mr-4">📍</div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Location</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="text-blue-600 mt-1">🏠</div>
                        <div>
                          <p className="font-semibold text-gray-900">Address</p>
                          <p className="text-gray-700 leading-relaxed">
                            Gemilina St. Zone 6<br />
                            Bugo<br />
                            Cagayan De Oro City, 9000<br />
                            Misamis Oriental
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">🕐</div>
                        <div>
                          <p className="font-semibold text-gray-900">Service Hours</p>
                          <p className="text-gray-600 text-sm">8:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">📅</div>
                        <div>
                          <p className="font-semibold text-gray-900">Availability</p>
                          <p className="text-gray-600 text-sm">Mon - Sat</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link 
                      to="/call-us"
                      className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold
                                 hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span>📞</span>
                      <span>Contact Us Now</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-[600px]">
                <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center p-8">
                  <div className="relative group">
                    <img 
                      src={myImage} 
                      alt="EER Aircon Services Location Map" 
                      className="w-full max-w-md rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 border-4 border-white"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-12 text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Experience Our Service?</h2>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us with their cooling needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/booking"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Schedule Service
                </Link>
                <Link 
                  to="/services"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
                >
                  View Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;