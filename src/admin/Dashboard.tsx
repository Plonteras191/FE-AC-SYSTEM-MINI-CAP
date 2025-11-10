import { useState, useEffect, useRef } from 'react';
import PageWrapper from '../components/PageWrapper.tsx';
import apiClient, { appointmentsApi } from '../services/api.tsx';
import { FaCalendarAlt, FaBell, FaChartLine, FaCheck, FaClock, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Appointment {
  id: number;
  name: string;
  status?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  appointmentId: number;
}

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [processedAppointmentIds, setProcessedAppointmentIds] = useState<Set<number>>(new Set());
  const notificationRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside notification panel to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load processed appointment IDs from localStorage on component mount
  useEffect(() => {
    try {
      const savedIds = localStorage.getItem('processedAppointmentIds');
      if (savedIds) {
        setProcessedAppointmentIds(new Set(JSON.parse(savedIds)));
      }
    } catch (error) {
      console.error("Error loading processed appointment IDs:", error);
    }
  }, []);

  // Fetch all necessary data when component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const appointmentsData = await fetchAppointments();
        await fetchRevenueHistory();
        
        // Check for new pending appointments
        checkForNewAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchAllData();
    // Refresh data every 2 minutes
    const interval = setInterval(fetchAllData, 120000);
    return () => clearInterval(interval);
  }, []);

  // Check for new appointments and create notifications
  const checkForNewAppointments = (newAppointments: Appointment[]): void => {
    if (!newAppointments) return;
    
    // Filter for new pending appointments that weren't already processed
    const newPendingAppointments = newAppointments.filter(
      (app: Appointment) => app.status && 
      app.status.toLowerCase() === 'pending' && 
      !processedAppointmentIds.has(app.id)
    );
    
    // Create notifications for new pending appointments
    if (newPendingAppointments.length > 0) {
      const newNotifications = newPendingAppointments.map((app: Appointment) => ({
        id: `notif-${app.id}`,
        title: 'New Pending Appointment',
        message: `${app.name} has requested an appointment`,
        time: new Date().toISOString(),
        appointmentId: app.id,
        read: false
      }));
      
      // Update notifications state - properly merging and deduplicating
      setNotifications(prev => {
        // Remove any duplicates by appointmentId
        const uniqueNotifications = [...prev];
        newNotifications.forEach((newNotif: Notification) => {
          const existingIndex = uniqueNotifications.findIndex(
            (existingNotif: Notification) => existingNotif.appointmentId === newNotif.appointmentId
          );
          
          if (existingIndex >= 0) {
            uniqueNotifications.splice(existingIndex, 1);
          }
          
          uniqueNotifications.unshift(newNotif); // Add to beginning
        });
        
        return uniqueNotifications;
      });
      
      // Add the processed appointment IDs to avoid duplicates
      const updatedProcessedIds = new Set(processedAppointmentIds);
      newPendingAppointments.forEach((app: Appointment) => updatedProcessedIds.add(app.id));
      setProcessedAppointmentIds(updatedProcessedIds);
      
      // Save processed IDs to localStorage
      localStorage.setItem('processedAppointmentIds', JSON.stringify([...updatedProcessedIds]));
    }
  };

  // Update unread count whenever notifications change
  useEffect(() => {
    const actualUnreadCount = notifications.filter(n => !n.read).length;
    setUnreadCount(actualUnreadCount);
  }, [notifications]);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await appointmentsApi.getAll();
      let data = response.data;
      if (!Array.isArray(data)) data = [data];
      setAppointments(data);
      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };

  // Fetch revenue history
  const fetchRevenueHistory = async () => {
    try {
      const response = await apiClient.get('/revenue-history');
      if (response.data && response.data.history) {
        const history = response.data.history;
        // Calculate current month revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = history.reduce((sum: number, entry: any) => {
          const entryDate = new Date(entry.revenue_date);
          if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
            return sum + parseFloat(entry.total_revenue);
          }
          return sum;
        }, 0);
        
        setCurrentMonthRevenue(monthlyRevenue);
        return history;
      } else {
        setCurrentMonthRevenue(0);
        return [];
      }
    } catch (error) {
      console.error("Error fetching revenue history:", error);
      setCurrentMonthRevenue(0);
      return [];
    }
  };

  // Calculate appointment statistics for the summary cards
  const getAppointmentStats = () => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status && a.status.toLowerCase() === 'pending').length;
    const accepted = appointments.filter(a => a.status && a.status.toLowerCase() === 'accepted').length;
    const completed = appointments.filter(a => a.status && a.status.toLowerCase() === 'completed').length;
    const rejected = appointments.filter(a => a.status && a.status.toLowerCase() === 'rejected').length;
    
    return { total, pending, accepted, completed, rejected };
  };

  // Handle notification click - just mark as read
  const handleNotificationClick = (notification: Notification): void => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? {...n, read: true} : n
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setShowNotifications(false);
    
    // Note: We don't clear processedAppointmentIds here
    // to prevent the same notifications from appearing again
  };

  // Format time for notifications
  const formatNotificationTime = (date: string): string => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return notifDate.toLocaleDateString();
  };

  // Get current month name
  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  // Sync notifications with pending appointments (one time setup)
  useEffect(() => {
    // This effect runs once when appointments are first loaded
    const hasNotifications = notifications.length > 0;
    
    if (!hasNotifications && appointments.length > 0) {
      // Initial setup - create notifications for existing pending appointments
      // that haven't been processed yet
      const pendingAppointments = appointments.filter(a => 
        a.status && 
        a.status.toLowerCase() === 'pending' && 
        !processedAppointmentIds.has(a.id)
      );
      
      if (pendingAppointments.length > 0) {
        // Create notifications without duplicating the check logic
        checkForNewAppointments(appointments);
      }
    }
  }, [appointments.length]);

  const stats = getAppointmentStats();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Top Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <h1 className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg">
                  <FaChartLine className="h-5 w-5 text-blue-600" />
                </span>
                Admin Dashboard
              </h1>
              
              {/* Right side controls */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Date display */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <FaCalendarAlt className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {/* Notification Bell */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FaBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Panel */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          {notifications.length > 0 && (
                            <button 
                              onClick={clearAllNotifications}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                              <FaBell className="h-8 w-8 mb-2 text-gray-300" />
                              <p className="text-sm">No new notifications</p>
                            </div>
                          ) : (
                            notifications.map(notification => (
                              <div 
                                key={notification.id}
                                className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  </div>
                                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                    {formatNotificationTime(notification.time)}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* User Profile */}
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                  <FaUser className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
            {/* Total Appointments Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200"
            >
                <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Appointments</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <FaCalendarAlt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </motion.div>
            
            {/* Pending Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                  <FaClock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}%` }}
                ></div>
              </div>
              {stats.pending > 0 && (
                <div className="flex items-center text-amber-700 text-xs font-medium">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  Requires attention
                </div>
              )}
            </motion.div>
            
            {/* Accepted Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Accepted</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.accepted}</h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <FaCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%` }}></div>
              </div>
            </motion.div>
            
            {/* Completed Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.completed}</h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <FaCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}></div>
              </div>
            </motion.div>
            
            {/* Revenue Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{getCurrentMonthName()} Revenue</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    ₱{currentMonthRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-sky-100 rounded-lg">
                  <FaChartLine className="h-6 w-6 text-sky-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-sky-500 h-2 rounded-full transition-all duration-300" style={{ width: '60%' }}></div>
              </div>
            </motion.div>
          </div>
          
          {/* Performance Metrics Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <span className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                <FaChartLine className="h-5 w-5 text-indigo-600" />
              </span>
              Performance Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Acceptance Rate */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Acceptance Rate</span>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Completion Rate */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Rejection Rate */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Rejection Rate</span>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;