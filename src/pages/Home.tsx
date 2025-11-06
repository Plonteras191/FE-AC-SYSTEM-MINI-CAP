import { Link } from 'react-router-dom';

const Home = () => (
  <>
   
    <section className="relative bg-linear-to-r from-blue-500 to-cyan-500 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">CDOC EER Aircon Cleaning and Repair-Home Service</h1>
        <p className="text-xl md:text-2xl mb-8">Professional Services · NC2/NC3 Certified Technicians</p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/booking" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Schedule Now
          </Link>
         
        </div>
      </div>
    </section>

    
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4 text-center">❄️</div>
          <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Fast Response</h3>
          <p className="text-gray-600 text-center">Professional Services</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4 text-center">🔧</div>
          <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Expert Technicians</h3>
          <p className="text-gray-600 text-center">NC2/NC3-certified professionals with 10+ years experience</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4 text-center">₱</div>
          <h3 className="text-xl font-bold mb-3 text-center text-gray-800">Price Guarantee</h3>
          <p className="text-gray-600 text-center">Upfront pricing with no hidden fees</p>
        </div>
      </div>
    </section>

   
    <div className="max-w-6xl mx-auto px-4">
    
      <section className="py-16 text-center bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl my-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Stay Cool?</h2>
        <p className="text-lg mb-6">Contact us now for all your air conditioning needs.</p>
        <Link 
          to="/booking" 
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
        >
          Book Appointment
        </Link>
      </section>
    </div>
  </>
);

export default Home;