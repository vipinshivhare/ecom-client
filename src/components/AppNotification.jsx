import React from "react";
import '../styles/AppNotification.css'; 

const icons = {
  success: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#4BB543" opacity="0.15"/><path d="M10 17l4 4 8-8" stroke="#4BB543" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><animate attributeName="stroke-dasharray" from="0,24" to="24,0" dur="0.5s" fill="freeze"/></path></svg>
  ),
  error: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#dc3545" opacity="0.15"/><path d="M12 12l8 8M20 12l-8 8" stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round"><animate attributeName="stroke-dasharray" from="0,24" to="24,0" dur="0.5s" fill="freeze"/></path></svg>
  ),
  info: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#0dcaf0" opacity="0.15"/><path d="M16 10v2M16 16v6" stroke="#0dcaf0" strokeWidth="2.5" strokeLinecap="round"/><circle cx="16" cy="22" r="1.5" fill="#0dcaf0"/></svg>
  ),
  warning: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#ffc107" opacity="0.15"/><path d="M16 10v8" stroke="#ffc107" strokeWidth="2.5" strokeLinecap="round"/><circle cx="16" cy="22" r="1.5" fill="#ffc107"/></svg>
  ),
};

const AppNotification = ({ show, message, type = "success", onClose }) => { // Renamed component
  if (!show) return null;

  return (
    <div className={`notification-popup ${type}`}>
      <span className="notification-icon">{icons[type] || icons.success}</span>
      <span className="notification-message">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="notification-close-button"
          aria-label="Close notification"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4l-10 10" stroke="#333" strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>
      )}
    </div>
  );
};

export default AppNotification; // Export renamed component
