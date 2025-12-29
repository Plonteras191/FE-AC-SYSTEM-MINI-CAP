import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">❄️</span>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-wide">
                                    EER<span className="text-blue-500">Aircon</span>
                                </span>
                                <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                                    Cleaning & Repair Service
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Professional air conditioning services you can trust. We provide expert cleaning,
                            repair, and maintenance for all AC brands and models.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-blue-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-blue-500 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-400 hover:text-blue-500 transition-colors">
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking" className="text-gray-400 hover:text-blue-500 transition-colors">
                                    Book Appointment
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Get In Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <span className="text-blue-500 mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </span>
                                <span className="text-gray-400">+63 910 399 8178</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-blue-500 mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <span className="text-gray-400">info@eeraircon.com</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <span className="text-blue-500 mt-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </span>
                                <span className="text-gray-400">Cagayan de Oro City, Philippines</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-800 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                                <span className="sr-only">Facebook</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} EER Aircon Service. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
