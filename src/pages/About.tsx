import { Link } from 'react-router-dom';
import heroImage from "../assets/heroimg.jpg";
import myImage from "../assets/map.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gray-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Dedicated to Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Comfort & Safety
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Serving Cagayan de Oro with professional air conditioning solutions for over a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Company Story */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                  <span className="text-6xl block mb-4">❄️</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    More Than Just Repairs
                  </h2>
                  <div className="prose prose-lg text-gray-600 space-y-4">
                    <p>
                      At <span className="font-semibold text-blue-600">CDOC EER Aircon</span>, we believe that a comfortable home is a happy home. What started as a small team of technicians has grown into Cagayan de Oro's most trusted home service provider.
                    </p>
                    <p>
                      We are strictly committed to quality. Every technician in our team holds TESDA NC2/NC3 certifications, ensuring that the hands touching your appliances are trained, skilled, and professional.
                    </p>
                    <p>
                      Our mission is simple: to provide reliable, affordable, and high-quality cooling solutions that arrive right at your doorstep.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-blue-600 rounded-2xl p-6 text-white transform translate-y-8">
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-blue-100">Years of Service</div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-gray-400">Certified Team</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-4xl font-bold mb-2 text-blue-600">1k+</div>
                <div className="text-gray-600">Projects Done</div>
              </div>
              <div className="bg-cyan-500 rounded-2xl p-6 text-white transform translate-y-8">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-white">Support</div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-base font-bold text-blue-600 uppercase tracking-wide">Our Values</h2>
              <h3 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Built on Trust & Quality
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🏆', title: 'Excellence', desc: 'We never compromise on quality. Every job is done to the highest industry standards.' },
                { icon: '🤝', title: 'Integrity', desc: 'Honest pricing and transparent service. No hidden costs, just great results.' },
                { icon: '⚡', title: 'Reliability', desc: 'We value your time. Our team arrives on schedule and works efficiently.' }
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="lg:flex">
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4 text-blue-600">📍</div>
                  <h2 className="text-3xl font-bold text-gray-900">Visit Our HQ</h2>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Address</h4>
                    <p className="text-xl text-gray-900 font-medium">
                      Gemilina St. Zone 6, Bugo<br />
                      Cagayan De Oro City, 9000
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Hours</h4>
                      <p className="text-gray-900 font-medium">Mon - Sat</p>
                      <p className="text-blue-600">8:00 AM - 6:00 PM</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Coverage</h4>
                      <p className="text-gray-900 font-medium">CDO & Nearby</p>
                      <p className="text-blue-600">Home Service</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link
                      to="/call-us"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold
                                 hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
                    >
                      <span>Get Directions / Contact</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 relative min-h-[400px]">
                <img
                  src={myImage}
                  alt="EER Aircon Services Location Map"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/10 hover:bg-transparent transition-colors duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;