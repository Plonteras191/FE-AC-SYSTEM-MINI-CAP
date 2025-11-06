import { useLocation, useNavigate } from 'react-router-dom';

interface Service {
  type: string;
  date: string;
  acTypes: string[];
}

interface BookingData {
  name?: string;
  phone?: string;
  email?: string;
  completeAddress?: string;
  services?: Service[];
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData: BookingData = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-center text-green-600 mb-6">Appointment Pending!</h2>
        <div className="text-center bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <p className="text-lg text-gray-700 mb-2">Thank you for booking your appointment with our AC service!</p>
          <p className="text-lg text-gray-700">Your appointment details have been received and are being processed.</p>
         
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">Booking Summary</h3>
          
          <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h4>
            <ul className="space-y-2">
              <li className="text-gray-700">
                <span className="font-semibold">Name:</span> {bookingData.name}
              </li>
              <li className="text-gray-700">
                <span className="font-semibold">Phone:</span> {bookingData.phone}
              </li>
              {bookingData.email && (
                <li className="text-gray-700">
                  <span className="font-semibold">Email:</span> {bookingData.email}
                </li>
              )}
            </ul>
          </div>

          <div className="mb-6 bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Service Location</h4>
            <p className="text-gray-700">{bookingData.completeAddress}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Requested Services</h4>
            {bookingData.services && bookingData.services.length > 0 ? (
              <div className="space-y-4">
                {bookingData.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-blue-600">{service.type}</span>
                      <span className="text-gray-600">{service.date}</span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold">AC Types:</span> {service.acTypes.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No services selected</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;