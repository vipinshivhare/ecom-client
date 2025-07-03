import React from "react";

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

const bgColors = {
  success: 'rgba(75, 181, 67, 0.25)',
  error: 'rgba(220, 53, 69, 0.25)',
  info: 'rgba(13, 202, 240, 0.25)',
  warning: 'rgba(255, 193, 7, 0.25)',
};

const borderColors = {
  success: '#4BB543',
  error: '#dc3545',
  info: '#0dcaf0',
  warning: '#ffc107',
};

const Notification = ({ show, message, type = "success", onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 40,
        right: 32,
        minWidth: 280,
        maxWidth: 400,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: `backdrop-filter: blur(12px); background: ${bgColors[type] || '#fff'};`,
        color: borderColors[type] || '#333',
        padding: "18px 28px 18px 18px",
        borderRadius: 18,
        border: `1.5px solid ${borderColors[type] || '#333'}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        zIndex: 2000,
        fontSize: 17,
        fontWeight: 500,
        animation: "slideGlassInOut 3s forwards",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "box-shadow 0.2s",
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icons[type] || icons.success}</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          aria-label="Close notification"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4l-10 10" stroke={borderColors[type] || '#333'} strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>
      )}
      <style>{`
        @keyframes slideGlassInOut {
          0% { opacity: 0; transform: translateX(60px) scale(0.98); }
          10% { opacity: 1; transform: translateX(0) scale(1); }
          90% { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(60px) scale(0.98); }
        }
      `}</style>
    </div>
  );
};

export default Notification; 