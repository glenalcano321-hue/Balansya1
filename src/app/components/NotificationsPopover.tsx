import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { useNotification, NotificationType } from './NotificationsContext';

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return 'Older';
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        type="button" // Added type="button" to prevent form submission issues
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] overflow-hidden" 
          // Changed z-50 to z-[100] and shadow-lg to shadow-xl to ensure it floats above everything
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto bg-white"> 
            {/* Added bg-white to ensure the content area isn't transparent */}
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(notif.time)}
                    </div>
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <button 
              onClick={markAllAsRead}
              className="w-full p-3 text-xs text-center text-gray-500 hover:text-blue-600 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100 bg-white"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}