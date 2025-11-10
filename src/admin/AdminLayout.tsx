import { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper.tsx';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const context = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!context) {
    throw new Error('AdminLayout must be used within an AuthProvider');
  }
  const { logout } = context;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navigationItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      to: '/admin/appointments',
      label: 'Appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      to: '/admin/admin-booking',
      label: 'Admin Booking',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      to: '/admin/reports',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      to: '/admin/calendar',
      label: 'Calendar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      to: '/admin/revenue',
      label: 'Revenue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-72 h-screen bg-white/95 backdrop-blur-sm shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AC System
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-[1.01]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-blue-200' : 'text-gray-400 group-hover:text-blue-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;