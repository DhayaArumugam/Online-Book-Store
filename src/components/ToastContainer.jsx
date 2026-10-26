import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { useCart } from "../context/useCart";

export default function ToastContainer() {
  const { toasts, removeToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon =
          toast.type === "success"
            ? CheckCircle2
            : toast.type === "warning"
            ? AlertCircle
            : Info;

        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
            role="status"
          >
            <div className="toast-icon">
              <Icon size={18} />
            </div>

            <div className="toast-content">
              <strong className="toast-title">{toast.title}</strong>
              {toast.message && <p className="toast-message">{toast.message}</p>}
            </div>

            <button
              type="button"
              className="toast-close"
              aria-label="Close notification"
              onClick={() => removeToast(toast.id)}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
