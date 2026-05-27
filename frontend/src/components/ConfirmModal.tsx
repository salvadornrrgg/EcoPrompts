interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

export const ConfirmModal = ({ message, onConfirm, onCancel, confirmLabel = 'Confirmar' }: ConfirmModalProps) => (
  <div className="eco-overlay fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onCancel}>
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
      <h2 className="text-lg font-bold text-gray-900 mb-2">Tens a certeza?</h2>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);
