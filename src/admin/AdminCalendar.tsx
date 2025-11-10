import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaCalendarAlt, FaTools, FaUser, FaTimes, FaMapMarkerAlt, FaSnowflake } from 'react-icons/fa';
import { appointmentsApi } from '../services/api.tsx';

// Type definitions
interface Service {
  type: string;
  date: string;
  ac_types?: string[];
}

interface Appointment {
  id: number | string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  complete_address?: string;
  services: string | Service[];
  status: string;
  technician_names?: string[];
  technicians?: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  opacity?: string;
  allDay?: boolean;
  textColor?: string;
  extendedProps: {
    service: string;
    date: string;
    customer: string;
    phone: string;
    email?: string;
    address: string;
    acTypes: string[];
    technicians?: string[];
    status: string;
    bookingId: number | string;
  };
}

const AdminCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [hoverEvent, setHoverEvent] = useState<CalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentsApi.getAll()
      .then(response => {
        let appointments = response.data;
        if (!Array.isArray(appointments)) appointments = [appointments];
        
        // Extract unique service types from all appointments
        const allServiceTypes = new Set<string>();
        appointments.forEach((appt: Appointment) => {
          try {
            const services = JSON.parse(appt.services as string || '[]');
            services.forEach((service: Service) => {
              if (service.type) allServiceTypes.add(service.type);
            });
          } catch (error) {
            console.error("Error parsing services:", error);
          }
        });
        setServiceTypes([...allServiceTypes]);
        
        // Map each appointment service into a FullCalendar event
        const calendarEvents: CalendarEvent[] = [];
        appointments.forEach((appt: Appointment) => {
          try {
            const services = JSON.parse(typeof appt.services === 'string' ? appt.services : '[]');
            
            services.forEach((service: Service) => {
              // Determine color based on service type
              const serviceColors: { [key: string]: string } = {
                'Cleaning': '#4e73df',
                'Repair': '#e74a3b',
                'Installation': '#1cc88a',
                'Maintenance': '#f6c23e',
                'Checkup': '#808080'
              };
              
              // Status modifiers (make events slightly transparent based on status)
              const statusOpacity: { [key: string]: string } = {
                'Pending': '0.7',
                'Accepted': '1',
                'Completed': '0.5'
              };
              
              const defaultColor = '#6c757d';
              const backgroundColor = serviceColors[service.type] || defaultColor;
              const opacity = statusOpacity[appt.status] || '1';
              
              calendarEvents.push({
                id: `${appt.id}-${service.type}`,
                title: `${service.type} (ID: ${appt.id})`,
                start: service.date, // Assuming date format is compatible with FullCalendar
                allDay: true, // Set to false if you add specific time
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                textColor: '#ffffff',
                opacity: opacity,
                extendedProps: { 
                  bookingId: appt.id,
                  service: service.type,
                  customer: appt.name || 'Customer',
                  phone: appt.phone,
                  email: appt.email,
                  address: appt.complete_address || appt.address || '',
                  status: appt.status || 'Pending',
                  acTypes: service.ac_types || [],
                  date: service.date,
                  technicians: appt.technicians || []
                }
              });
            });
          } catch (error) {
            console.error("Error creating events:", error);
          }
        });
        
        setEvents(calendarEvents);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle event click to show details modal
  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
  };

  // Handle event hover
  const handleEventMouseEnter = (mouseEnterInfo: any) => {
    setHoverEvent(mouseEnterInfo.event);
    
    // Use requestAnimationFrame to ensure DOM is fully updated
    requestAnimationFrame(() => {
      const element = mouseEnterInfo.el;
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 320;
      const tooltipHeight = 350;
      const gap = 12;
      
      // Calculate position: try right side first
      let x = rect.right + gap;
      let y = rect.top;
      
      // If tooltip overflows on right, position on left
      if (x + tooltipWidth > viewportWidth) {
        x = rect.left - tooltipWidth - gap;
      }
      
      // If tooltip still overflows on left, center it
      if (x < 0) {
        x = Math.max(10, (viewportWidth - tooltipWidth) / 2);
      }
      
      // Check vertical overflow
      if (y + tooltipHeight > viewportHeight) {
        y = Math.max(10, viewportHeight - tooltipHeight - 10);
      }
      
      setTooltipPosition({ x, y });
    });
  };

  // Handle mouse leave
  const handleEventMouseLeave = () => {
    setHoverEvent(null);
  };

  // Close event detail modal
  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  // Filter events by service type and status
  const filteredEvents = events.filter(event => {
    const serviceMatch = filterType === 'all' || event.extendedProps.service === filterType;
    const statusMatch = filterStatus === 'all' || event.extendedProps.status === filterStatus;
    return serviceMatch && statusMatch;
  });

  // Format date for display in the modal and tooltip
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format AC Types for display
  const formatAcTypes = (acTypes: string[]) => {
    if (!acTypes || acTypes.length === 0) return 'None specified';
    return acTypes.join(', ');
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Service Appointment Calendar
              </h2>
              <p className="text-gray-500 text-sm">Manage and view all scheduled services</p>
            </div>
          </div>
          
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Service Filter */}
              <div className="space-y-1">
                <label htmlFor="serviceFilter" className="block text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <select 
                  id="serviceFilter" 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full sm:w-40 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="all">All Services</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div className="space-y-1">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select 
                  id="statusFilter" 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full sm:w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            
            {/* Refresh Button */}
            <div className="flex items-end">
              <button 
                onClick={fetchAppointments} 
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FaTools className="text-white text-sm" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Service Type Legend</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: '#4e73df'}}></div>
            <span className="text-sm font-medium text-gray-700">Cleaning</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl border border-red-100">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: '#e74a3b'}}></div>
            <span className="text-sm font-medium text-gray-700">Repair</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: '#1cc88a'}}></div>
            <span className="text-sm font-medium text-gray-700">Installation</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: '#f6c23e'}}></div>
            <span className="text-sm font-medium text-gray-700">Maintenance</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: '#808080'}}></div>
            <span className="text-sm font-medium text-gray-700">Checkup</span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">Loading appointments...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your calendar data</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 overflow-hidden">
          <FullCalendar 
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title'
            }}
            events={filteredEvents}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            height="auto"
            eventClick={handleEventClick}
            nowIndicator={true}
            dayMaxEvents={true}
            eventDisplay="block"
            eventMouseEnter={handleEventMouseEnter}
            eventMouseLeave={handleEventMouseLeave}
            eventContent={(eventInfo) => {
              return (
                <div className="p-1 rounded-md transition-all duration-200 hover:scale-105 cursor-pointer" style={{opacity: eventInfo.event.extendedProps.opacity}}>
                  <div className="text-xs font-medium text-white truncate">{eventInfo.event.title}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <FaUser className="text-white/80" size="0.7em" />
                    <span className="text-xs text-white/90 truncate">{eventInfo.event.extendedProps.customer}</span>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
      
      {/* Event Hover Tooltip - Moved outside calendar wrapper */}
      {hoverEvent && (
        <div 
          className="fixed z-9999 w-80 bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            position: 'fixed',
            willChange: 'transform'
          }}
        >
              <div 
                className="px-4 py-3 text-white"
                style={{backgroundColor: hoverEvent.backgroundColor}}
              >
                <h4 className="font-semibold text-lg">{hoverEvent.extendedProps.service}</h4>
                <p className="text-white/90 text-sm">Service Details</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <FaCalendarAlt className="text-blue-500 w-4 h-4 shrink-0" />
                  <span className="text-gray-700">{formatDate(hoverEvent.extendedProps.date)}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FaUser className="text-blue-500 w-4 h-4 shrink-0" />
                  <span className="text-gray-700">{hoverEvent.extendedProps.customer}</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <FaMapMarkerAlt className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-gray-700 line-clamp-2">{hoverEvent.extendedProps.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FaSnowflake className="text-blue-500 w-4 h-4 shrink-0" />
                  <span className="text-gray-700">AC Types: {formatAcTypes(hoverEvent.extendedProps.acTypes)}</span>
                </div>
                {hoverEvent.extendedProps.technicians && hoverEvent.extendedProps.technicians.length > 0 && (
                  <div className="flex items-center space-x-3 text-sm">
                    <FaTools className="text-blue-500 w-4 h-4 shrink-0" />
                    <span className="text-gray-700">Technicians: {hoverEvent.extendedProps.technicians.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    hoverEvent.extendedProps.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    hoverEvent.extendedProps.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    hoverEvent.extendedProps.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {hoverEvent.extendedProps.status}
                  </span>
                  <span className="text-xs text-gray-500">Click for more details</span>
                </div>
              </div>
            </div>
          )}
      
      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeEventModal}>
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div 
              className="px-6 py-4 text-white relative"
              style={{backgroundColor: selectedEvent.backgroundColor}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedEvent.extendedProps.service}</h3>
                  <p className="text-white/90 text-sm">Service Appointment Details</p>
                </div>
                <button 
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                  onClick={closeEventModal}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Date and Service Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <FaCalendarAlt className="text-blue-600 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedEvent.extendedProps.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <FaTools className="text-purple-600 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Service Type</p>
                    <p className="text-sm text-gray-600">{selectedEvent.extendedProps.service}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                  <FaUser className="text-gray-600" />
                  <span>Customer Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-sm text-gray-600">{selectedEvent.extendedProps.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{selectedEvent.extendedProps.phone}</p>
                  </div>
                  {selectedEvent.extendedProps.email && (
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-600">{selectedEvent.extendedProps.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <FaMapMarkerAlt className="text-green-600 w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Service Address</p>
                  <p className="text-sm text-gray-600">{selectedEvent.extendedProps.address}</p>
                </div>
              </div>

              {/* AC Types */}
              <div className="flex items-center space-x-3 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                <FaSnowflake className="text-cyan-600 w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">AC Types</p>
                  <p className="text-sm text-gray-600">{formatAcTypes(selectedEvent.extendedProps.acTypes)}</p>
                </div>
              </div>

              {/* Technicians */}
              {selectedEvent.extendedProps.technicians && selectedEvent.extendedProps.technicians.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h4 className="font-semibold text-gray-800 flex items-center space-x-2 mb-3">
                    <FaTools className="text-orange-600" />
                    <span>Assigned Technicians</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.extendedProps.technicians.map((tech, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking ID and Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-700">Booking ID</p>
                  <p className="text-lg font-mono font-bold text-gray-800">#{selectedEvent.extendedProps.bookingId}</p>
                </div>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  selectedEvent.extendedProps.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  selectedEvent.extendedProps.status === 'Accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                  selectedEvent.extendedProps.status === 'Completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  {selectedEvent.extendedProps.status}
                </span>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                className="px-6 py-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={closeEventModal}
              >
                Close
              </button>
              <button 
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                onClick={closeEventModal}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;