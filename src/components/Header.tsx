import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={closeMenu}
          >
            <div className="text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300">
              ❄️
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                EER Aircon
              </span>
              <span className="text-xs lg:text-sm text-gray-600 font-medium -mt-1">
                Service
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  About Us
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Services
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/call-us"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Call Us
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavLink
              to="/booking"
              className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm
                         hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Now
            </NavLink>
            
            <NavLink
              to="/admin/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              Admin
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden relative w-10 h-10 text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : 'translate-y-1.5'}`}></div>
              <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
              <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : '-translate-y-1.5'}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}>
          <nav className="py-4 space-y-2 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              🏠 Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              ℹ️ About Us
            </NavLink>

            <NavLink
              to="/services"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              🔧 Services
            </NavLink>

            <NavLink
              to="/call-us"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              📞 Call Us
            </NavLink>

            <div className="px-2 pt-4 pb-2 space-y-2">
              <NavLink
                to="/booking"
                onClick={closeMenu}
                className="block w-full bg-linear-to-r from-blue-600 to-cyan-600 text-white text-center px-4 py-3 rounded-xl font-semibold
                           hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
              >
                📅 Book Appointment
              </NavLink>
              
              <NavLink
                to="/admin/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300"
              >
                👤 Admin Login
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;