const Services = () => {
  const services = [
    {
      title: 'Cleaning',
      description: 'Professional cleaning services to maintain optimal airflow and efficiency of your air conditioning system.',
      price: 'Price range from ₱500 - 1500',
      icon: '🧹'
    },
    {
      title: 'Repair',
      description: 'Quick and reliable repairs to fix any issues with your air conditioning system, ensuring maximum comfort.',
      price: 'Price range from ₱1000 - 3000',
      icon: '🔧'
    },
    {
      title: 'Installation',
      description: 'Professional installation services for new air conditioning units with expert advice and support.',
      price: 'Price range from ₱1500 - 5000',
      icon: '⚙️'
    },
    {
      title: 'Checkup & Maintenance',
      description: 'Regular check-ups and preventative maintenance to keep your AC running efficiently and prevent unexpected breakdowns.',
      price: 'Price range from ₱800 - 2500',
      icon: '🔍'
    }
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4" id="services">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">Our Services</h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Professional air conditioning solutions for your home and business</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4 grow">{service.description}</p>
              {service.price && <p className="text-blue-600 font-semibold">{service.price}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;