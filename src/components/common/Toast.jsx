function Toast({ toast, onClose }) {
  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>

      <button className="toast-close" onClick={() => onClose(toast.id)}>
        ×
      </button>
    </div>
  );
}

export default Toast;
