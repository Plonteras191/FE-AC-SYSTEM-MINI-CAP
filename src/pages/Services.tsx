const Services = () => {
  const services = [
    {
      title: 'Cleaning',
      description: 'Professional cleaning services to maintain optimal airflow and efficiency of your air conditioning system.',
      price: 'Price range from ₱500 - 1500',
      icon: '🧹',
      gradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Repair',
      description: 'Quick and reliable repairs to fix any issues with your air conditioning system, ensuring maximum comfort.',
      price: 'Price range from ₱1000 - 3000',
      icon: '🔧',
      gradient: 'from-cyan-50 to-blue-50'
    },
    {
      title: 'Installation',
      description: 'Professional installation services for new air conditioning units with expert advice and support.',
      price: 'Price range from ₱1500 - 5000',
      icon: '⚙️',
      gradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Checkup & Maintenance',
      description: 'Regular check-ups and preventative maintenance to keep your AC running efficiently and prevent unexpected breakdowns.',
      price: 'Price range from ₱800 - 2500',
      icon: '🔍',
      gradient: 'from-cyan-50 to-blue-50'
    }
  ];

  return (
    <section className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-blue-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" id="services">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl text-white">❄️</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Our <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Services</span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional air conditioning solutions for your home and business with 
            <span className="font-semibold text-blue-600"> expert care</span> and 
            <span className="font-semibold text-cyan-500"> reliable service</span>
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`group relative bg-linear-to-br ${service.gradient} backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 flex flex-col items-center text-center transform hover:-translate-y-2 hover:scale-105`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/60 rounded-2xl backdrop-blur-sm"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                {/* Icon Container */}
                <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl filter drop-shadow-sm">{service.icon}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-6 grow leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>
                
                {/* Price */}
                {service.price && (
                  <div className="mt-auto">
                    <div className="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow duration-300">
                      {service.price}
                    </div>
                  </div>
                )}
                
                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 border border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Contact us today for a free consultation and experience the difference professional AC service makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-cyan-600">
                Book Now
              </button>
              <button className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Services;