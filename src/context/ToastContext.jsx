import { createContext, useContext, useMemo, useState } from "react";
import ToastContainer from "../components/common/ToastContainer";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = ({ type = "success", title = "", message = "" }) => {
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const value = useMemo(
    () => ({
      success(title, message) {
        showToast({ type: "success", title, message });
      },
      error(title, message) {
        showToast({ type: "error", title, message });
      },
      info(title, message) {
        showToast({ type: "info", title, message });
      },
      warning(title, message) {
        showToast({ type: "warning", title, message });
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
