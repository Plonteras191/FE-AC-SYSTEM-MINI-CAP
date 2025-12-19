import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PageWrapper from '../components/PageWrapper.tsx';
import apiClient, { appointmentsApi } from '../services/api.tsx';
import { FaCalendarAlt, FaBell, FaChartLine, FaCheck, FaClock, FaUser, FaSync, FaExclamationTriangle, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Constants
const POLLING_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes
const MAX_NOTIFICATIONS_DISPLAY = 9;
const LOCAL_STORAGE_KEY = 'processedAppointmentIds';

// Type Definitions
interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}

interface Appointment {
  id: number;
  name: string;
  status?: string;
  phone?: string;
  email?: string;
  complete_address?: string;
  services?: string | Service[];
  technicians?: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  appointmentId: number;
}

interface RevenueEntry {
  revenue_date: string;
  total_revenue: string | number;
}

interface AppointmentStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  rejected: number;
}

// Utility functions for localStorage with error handling
const saveToLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Sanitize user input to prevent XSS
const sanitizeString = (str: string): string => {
  // Create a temporary element to use browser's built-in HTML parser
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML.trim();
};

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [processedAppointmentIds, setProcessedAppointmentIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
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
    const savedIds = loadFromLocalStorage(LOCAL_STORAGE_KEY, []);
    if (Array.isArray(savedIds)) {
      setProcessedAppointmentIds(new Set(savedIds));
    }
  }, []);

  // Fetch all necessary data when component mounts
  const fetchAllData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      const appointmentsData = await fetchAppointments();
      await fetchRevenueHistory();
      
      // Check for new pending appointments
      checkForNewAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // Refresh data every 2 minutes
    const interval = setInterval(() => fetchAllData(), POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Check for new appointments and create notifications
  const checkForNewAppointments = useCallback((newAppointments: Appointment[]): void => {
    if (!newAppointments || !Array.isArray(newAppointments)) return;
    
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
        message: `${sanitizeString(app.name)} has requested an appointment`,
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
      setProcessedAppointmentIds(prev => {
        const updatedProcessedIds = new Set(prev);
        newPendingAppointments.forEach((app: Appointment) => updatedProcessedIds.add(app.id));
        
        // Save processed IDs to localStorage
        saveToLocalStorage(LOCAL_STORAGE_KEY, [...updatedProcessedIds]);
        
        return updatedProcessedIds;
      });
    }
  }, [processedAppointmentIds]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const actualUnreadCount = notifications.filter(n => !n.read).length;
    setUnreadCount(actualUnreadCount);
  }, [notifications]);

  // Fetch all appointments
  const fetchAppointments = async (): Promise<Appointment[]> => {
    try {
      const response = await appointmentsApi.getAll();
      let data = response.data;
      if (!Array.isArray(data)) data = [data];
      
      // Validate and sanitize appointment data with full details
      const validatedData = data.map((app: any) => ({
        id: Number(app.id) || 0,
        name: sanitizeString(String(app.name || 'Unknown')),
        status: app.status ? sanitizeString(String(app.status)) : undefined,
        phone: app.phone ? sanitizeString(String(app.phone)) : undefined,
        email: app.email ? sanitizeString(String(app.email)) : undefined,
        complete_address: app.complete_address ? sanitizeString(String(app.complete_address)) : undefined,
        services: app.services || undefined,
        technicians: Array.isArray(app.technicians) ? app.technicians : []
      }));
      
      setAppointments(validatedData);
      return validatedData;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  };

  // Fetch revenue history
  const fetchRevenueHistory = async (): Promise<RevenueEntry[]> => {
    try {
      const response = await apiClient.get('/revenue-history');
      if (response.data && response.data.history) {
        const history: RevenueEntry[] = response.data.history;
        // Calculate current month revenue
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = history.reduce((sum: number, entry: RevenueEntry) => {
          const entryDate = new Date(entry.revenue_date);
          if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
            const revenue = typeof entry.total_revenue === 'string' 
              ? parseFloat(entry.total_revenue) 
              : entry.total_revenue;
            return sum + (isNaN(revenue) ? 0 : revenue);
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
      throw error;
    }
  };

  // Calculate appointment statistics for the summary cards (memoized)
  const stats = useMemo<AppointmentStats>(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status?.toLowerCase() === 'pending').length;
    const accepted = appointments.filter(a => a.status?.toLowerCase() === 'accepted').length;
    const completed = appointments.filter(a => a.status?.toLowerCase() === 'completed').length;
    const rejected = appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length;
    
    return { total, pending, accepted, completed, rejected };
  }, [appointments]);

  // Get today's accepted appointments (memoized)
  const todaysSchedule = useMemo<Appointment[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return appointments.filter(appointment => {
      // Only show accepted appointments
      if (appointment.status?.toLowerCase() !== 'accepted') return false;
      
      // Check if any service is scheduled for today
      if (!appointment.services) return false;
      
      try {
        const services: Service[] = typeof appointment.services === 'string' 
          ? JSON.parse(appointment.services) 
          : appointment.services;
        
        return services.some((service: Service) => {
          const serviceDate = new Date(service.date).toISOString().split('T')[0];
          return serviceDate === today;
        });
      } catch (error) {
        console.error('Error parsing services for appointment:', appointment.id, error);
        return false;
      }
    });
  }, [appointments]);

  // Get upcoming appointments for the next 7 days (excluding today) (memoized)
  const upcomingAppointments = useMemo<Appointment[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    return appointments
      .filter(appointment => {
        // Only show accepted and pending appointments
        const status = appointment.status?.toLowerCase();
        if (status !== 'accepted' && status !== 'pending') return false;
        
        // Check if any service is scheduled within the next 7 days (excluding today)
        if (!appointment.services) return false;
        
        try {
          const services: Service[] = typeof appointment.services === 'string' 
            ? JSON.parse(appointment.services) 
            : appointment.services;
          
          return services.some((service: Service) => {
            const serviceDate = new Date(service.date);
            serviceDate.setHours(0, 0, 0, 0);
            
            // Check if service is after today and within 7 days
            return serviceDate > today && serviceDate <= sevenDaysFromNow;
          });
        } catch (error) {
          console.error('Error parsing services for appointment:', appointment.id, error);
          return false;
        }
      })
      .sort((a, b) => {
        // Sort by earliest service date
        try {
          const servicesA: Service[] = typeof a.services === 'string' ? JSON.parse(a.services) : a.services || [];
          const servicesB: Service[] = typeof b.services === 'string' ? JSON.parse(b.services) : b.services || [];
          
          const dateA = servicesA.length > 0 ? new Date(servicesA[0].date).getTime() : 0;
          const dateB = servicesB.length > 0 ? new Date(servicesB[0].date).getTime() : 0;
          
          return dateA - dateB;
        } catch {
          return 0;
        }
      });
  }, [appointments]);

  // Handle notification click - just mark as read
  const handleNotificationClick = useCallback((notification: Notification): void => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? {...n, read: true} : n
      )
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setShowNotifications(false);
    
    // Note: We don't clear processedAppointmentIds here
    // to prevent the same notifications from appearing again
  }, []);

  // Format time for notifications (memoized)
  const formatNotificationTime = useCallback((date: string): string => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return notifDate.toLocaleDateString();
  }, []);

  // Get current month name (memoized)
  const currentMonthName = useMemo(() => {
    return new Date().toLocaleString('default', { month: 'long' });
  }, []);

  // Format revenue (memoized)
  const formattedRevenue = useMemo(() => {
    return currentMonthRevenue.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }, [currentMonthRevenue]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchAllData(true);
  }, [fetchAllData]);

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
  }, [appointments.length, checkForNewAppointments]);

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

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
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh dashboard"
                >
                  <FaSync className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
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
                      {unreadCount > MAX_NOTIFICATIONS_DISPLAY ? `${MAX_NOTIFICATIONS_DISPLAY}+` : unreadCount}
                    </span>
                    )}
                  </button>
                  
                  {/* Notification Panel - Improved UX */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
                          <div className="flex items-center gap-2">
                            <FaBell className="h-4 w-4 text-blue-600" />
                            <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <button 
                              onClick={clearAllNotifications}
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors px-3 py-1 hover:bg-blue-100 rounded-md"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        
                        <div className="max-h-128 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500">
                              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                                <FaBell className="h-7 w-7 text-gray-400" />
                              </div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">All caught up!</p>
                              <p className="text-xs text-gray-500">No new notifications</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {notifications.map(notification => (
                                <motion.div 
                                  key={notification.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`px-5 py-4 cursor-pointer transition-all duration-150 ${
                                    !notification.read 
                                      ? 'bg-blue-50/80 hover:bg-blue-100/80 border-l-4 border-l-blue-500' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <div className="flex gap-3">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                                      !notification.read ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}>
                                      <FaBell className={`h-4 w-4 ${!notification.read ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                          {notification.title}
                                        </p>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                          {formatNotificationTime(notification.time)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      {!notification.read && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full"></span>
                                          <span className="text-xs font-medium text-blue-600">New</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm"
            >
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Dashboard</h3>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {/* Total Appointments Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
                <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{currentMonthName} Total Appointments</p>
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{currentMonthName} Revenue</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    ₱{formattedRevenue}
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
          
          {/* Performance Metrics Section - Compact Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <FaChartLine className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-gray-900">Performance Overview</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Acceptance Rate */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-600">Acceptance</span>
                  <span className="text-base font-bold text-blue-700">
                    {stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Completion Rate */}
              <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-600">Completion</span>
                  <span className="text-base font-bold text-green-700">
                    {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Cancellation Rate */}
              <div className="bg-linear-to-br from-red-50 to-red-100/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-600">Cancellation</span>
                  <span className="text-base font-bold text-red-700">
                    {stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-1.5">
                  <div 
                    className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Today's Schedule Section - Enhanced Focus */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.65 }}
            className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl shadow-sm">
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              {todaysSchedule.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm">
                  <FaCalendarAlt className="h-4 w-4" />
                  <span className="font-semibold">{todaysSchedule.length} Appointment{todaysSchedule.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            
            {todaysSchedule.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <FaCalendarAlt className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-1">No appointments scheduled for today</p>
                <p className="text-sm text-gray-500">Your schedule is clear. Check back later or view all appointments.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {todaysSchedule.map((appointment, index) => {
                  const services = typeof appointment.services === 'string' 
                    ? JSON.parse(appointment.services) 
                    : appointment.services || [];
                  
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-xl border-2 border-green-200 p-5 hover:shadow-lg hover:border-green-300 transition-all duration-200 group"
                    >
                      <div className="flex flex-col lg:flex-row gap-5">
                        {/* Left Section - Customer Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-md shrink-0 group-hover:scale-110 transition-transform duration-200">
                              <FaUser className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {appointment.name}
                              </h3>
                              <div className="space-y-1.5">
                                {appointment.phone && (
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
                                      <FaPhone className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="font-medium">{appointment.phone}</span>
                                  </div>
                                )}
                                {appointment.complete_address && (
                                  <div className="flex items-start gap-2 text-sm text-gray-700">
                                    <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-md shrink-0 mt-0.5">
                                      <FaMapMarkerAlt className="h-3 w-3 text-orange-600" />
                                    </div>
                                    <span className="line-clamp-2 leading-relaxed">{appointment.complete_address}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Section - Services & Technicians */}
                        <div className="flex flex-col sm:flex-row gap-5 lg:min-w-[400px]">
                          {/* Services */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Services</span>
                            </div>
                            <div className="space-y-2">
                              {services.map((service: Service, idx: number) => (
                                <div key={idx} className="flex flex-col gap-1">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-600 text-white shadow-sm w-fit">
                                    {service.type}
                                  </span>
                                  {service.ac_types && service.ac_types.length > 0 && (
                                    <span className="text-xs text-gray-600 ml-1">
                                      {service.ac_types.join(', ')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Technicians */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Technicians</span>
                            </div>
                            {appointment.technicians && appointment.technicians.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {appointment.technicians.map((tech, idx) => (
                                  <span 
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-sm"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 w-fit">
                                <FaExclamationTriangle className="h-3 w-3 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">
                                  Not assigned yet
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
          
          {/* Upcoming Appointments Section (Next 7 Days) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              </div>
              {upcomingAppointments.length > 0 && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  Next 7 Days
                </span>
              )}
            </div>
            
            {upcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <FaCalendarAlt className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600">No upcoming appointments in the next 7 days</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {upcomingAppointments.map((appointment, index) => {
                  const services: Service[] = typeof appointment.services === 'string' 
                    ? JSON.parse(appointment.services) 
                    : appointment.services || [];
                  
                  // Get the earliest service date for display
                  const earliestService = services.reduce((earliest, service) => {
                    return new Date(service.date) < new Date(earliest.date) ? service : earliest;
                  }, services[0]);
                  
                  const appointmentDate = new Date(earliestService.date);
                  const isToday = appointmentDate.toDateString() === new Date().toDateString();
                  const isTomorrow = appointmentDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
                  
                  let dateLabel = appointmentDate.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  
                  if (isToday) dateLabel = 'Today';
                  if (isTomorrow) dateLabel = 'Tomorrow';
                  
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 group"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-indigo-600 group-hover:bg-indigo-700 rounded-lg shadow-sm shrink-0 transition-colors">
                        <span className="text-xs font-semibold text-indigo-200 uppercase">
                          {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-white">
                          {appointmentDate.getDate()}
                        </span>
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{appointment.name}</h4>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${
                            appointment.status?.toLowerCase() === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <FaClock className="h-3 w-3" />
                          <span className="font-medium">{dateLabel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {services.map((service, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700"
                            >
                              {service.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;