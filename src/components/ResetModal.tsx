import React from 'react';

interface ResetModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  theme?: 'light' | 'dark';
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
}

const ResetModal: React.FC<ResetModalProps> = ({
  open,
  onCancel,
  onConfirm,
  theme = 'light',
  title,
  message,
  cancelLabel,
  confirmLabel,
}) => {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onCancel}
    >
      <div
        className="modal-content"
        style={{
          background: theme === 'dark' ? '#222' : '#fff',
          color: theme === 'dark' ? '#f3f4f6' : '#222',
          borderRadius: 12,
          padding: 32,
          minWidth: 280,
          boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 16 }}>{title}</h3>
        <p style={{ marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: '6px 18px',
              cursor: 'pointer',
              color: theme === 'dark' ? '#f3f4f6' : '#222',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: '#e11d48',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 18px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
