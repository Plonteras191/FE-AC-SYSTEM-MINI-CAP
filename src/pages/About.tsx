
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">About Us</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-12">
        Welcome to ❄️ EER Aircon Services – your trusted partner in air conditioning solutions. We are dedicated to providing high-quality and reliable cooling services to both homes and businesses in our community,
         ensuring your comfort is always our top priority. With a commitment to excellence and customer satisfaction, we specialize in air conditioning installation, maintenance, repairs, and now offer convenient home service,
          delivering expert care right to your doorstep. Our team of skilled professionals is equipped with the expertise and experience to handle all types of air conditioning systems, ensuring optimal performance and energy efficiency for your complete peace of mind.
        </p>
        <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Our Address</h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Gemilina St.Zone 6.<br />
              Bugo<br />
              Cagayan De Oro City, 9000<br />
              Misamis Oriental
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img src={myImage} alt="Description" className="w-full max-w-sm rounded-lg shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;