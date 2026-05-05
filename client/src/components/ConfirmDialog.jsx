import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-400">{message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="btn-danger !bg-rose-600 !text-white hover:!bg-rose-500 border-0"
            >
              {loading ? 'Deleting...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
