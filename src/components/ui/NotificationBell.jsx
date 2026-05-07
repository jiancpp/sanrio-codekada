import React, { useState, useEffect } from 'react';
import socket from "../../hooks/socket"
import { useApi } from "../../hooks/useApi"
import { getTimeAgo } from "../../hooks/utils"
import { useNavigate } from 'react-router';

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { getNotifications } = useApi();
  const navigate = useNavigate();

  const getStoredUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") ||
        sessionStorage.getItem("user")
      );
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getStoredUser();
  
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
  
    if (!user || !token) {
      navigate("/login");
      return;
    }
  
    // JOIN ROOM
    if (user.familyCode) {
      socket.emit("join-family", user.familyCode);
    }
  
    // INITIAL FETCH
    const fetchData = async () => {
      try {
        const data = await getNotifications(user.id);
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  
  }, []);

  useEffect(() => {

    const notificationHandler = (newNotification) => {
      console.log("NEW NOTIFICATION:", newNotification);
  
      setNotifications((prev) => [
        newNotification,
        ...prev
      ]);
    };
  
    socket.on("notification", notificationHandler);
  
    return () => {
      socket.off("notification", notificationHandler);
    };
  
  }, []);


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
                <span className="text-xs text-midnight font-bold mr-2">{n.from.name}</span>
                <span className="text-xs text-mauve">{getTimeAgo(n.createdAt)}</span>
                <p className="text-sm text-midnight">{n.message}</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationBell;