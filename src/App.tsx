import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import CallUs from './pages/CallUs';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';

import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import AdminAppointments from './admin/AdminAppointments';
import AdminReports from './admin/AdminReports';
import AdminCalendar from './admin/AdminCalendar';
import Revenue from './admin/Revenue';
import ManualBooking from './admin/ManualBooking';
import AdminTechnicians from './admin/AdminTechnicians';
import AdminLayout from './admin/AdminLayout';

import PageWrapper from './components/PageWrapper';
import Footer from './components/Footer';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
        <Route path="/call-us" element={<PageWrapper><CallUs /></PageWrapper>} />
        <Route path="/booking" element={<PageWrapper><Booking /></PageWrapper>} />
        <Route path="/confirmation" element={<PageWrapper><Confirmation /></PageWrapper>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />

        {/* Protected Admin Routes nested under AdminLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="appointments" element={<PageWrapper><AdminAppointments /></PageWrapper>} />
            <Route path="admin-booking" element={<PageWrapper><ManualBooking /></PageWrapper>} />
            <Route path="reports" element={<PageWrapper><AdminReports /></PageWrapper>} />
            <Route path="calendar" element={<PageWrapper><AdminCalendar /></PageWrapper>} />
            <Route path="revenue" element={<PageWrapper><Revenue /></PageWrapper>} />
            <Route path="technicians" element={<PageWrapper><AdminTechnicians /></PageWrapper>} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminRoute && <Header />}
      <AnimatedRoutes />
      {!isAdminRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
};

export default App;