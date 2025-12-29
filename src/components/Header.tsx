import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-white py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center space-x-3 group"
            onClick={closeMenu}
          >
            <div className="bg-blue-50 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">❄️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                EER<span className="text-blue-600">Aircon</span>
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                Cleaning & Repair Service
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-colors duration-300 py-2 group ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`
              }
            >
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-colors duration-300 py-2 group ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`
              }
            >
              Services
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-colors duration-300 py-2 group ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`
              }
            >
              About Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </NavLink>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex flex-col items-end mr-4">
              <span className="text-xs text-gray-500 font-medium">Need Help?</span>
              <span className="text-sm font-bold text-gray-900">+63 910 399 8178</span>
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavLink
              to="/call-us"
              className="px-5 py-2.5 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-lg 
                         hover:bg-blue-50 transition-colors duration-300"
            >
              Call Now
            </NavLink>
            <NavLink
              to="/booking"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg 
                         hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Service
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="flex flex-col space-y-2 pb-4">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/call-us"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              Contact Us
            </NavLink>
            <div className="pt-2">
              <NavLink
                to="/booking"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;