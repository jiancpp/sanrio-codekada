import React, { useState } from 'react';

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  // temporary mock notifications
  const notifications = [
    { id: 1, from: "Mama", text: "Medication reminder: Take Vitamin C", time: "10 min ago" },
    { id: 2, from: "Papa", text: "Family update: New lab result uploaded", time: "2 hrs ago" },
    { id: 3, from: "Lola", text: "Check-up due this week", time: "1 day ago" }
  ];

  return (
    <div className="relative">
      
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-egg border border-olive-light rounded-full p-2 shadow-sm hover:shadow-md transition"
      >
        🔔

        {/* Red dot indicator */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full animate-pulse"></span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-egg border border-olive-light shadow-xl rounded-2xl overflow-hidden z-50">

          <div className="px-4 py-3 border-b border-olive-light font-bold text-sm text-midnight">
            Notifications
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="px-4 pb-3 bg-white cursor-pointer transition"
              >
                <span className="text-xs text-midnight font-bold mr-2">{n.from}</span>
                <span className="text-xs text-mauve">{n.time}</span>
                <p className="text-sm text-midnight">{n.text}</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationBell;