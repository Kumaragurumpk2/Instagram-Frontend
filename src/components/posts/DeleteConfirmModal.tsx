import React from 'react';

interface Props {
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  message?: string;
}

const DeleteConfirmModal: React.FC<Props> = ({
  onConfirm,
  onCancel,
  message = 'Are you sure you want to delete this post? This action cannot be undone.',
}) => (
  <div className="ic-modal-overlay" onClick={onCancel}>
    <div className="ic-modal p-4" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(239,68,68,0.12)',
          }}
        >
          <i className="bi bi-trash3 text-danger" style={{ fontSize: '1.8rem' }} />
        </div>
        <h5 className="fw-bold mb-2">Delete Post</h5>
        <p className="text-ic-muted" style={{ fontSize: '0.9rem' }}>{message}</p>
      </div>
      <div className="d-grid gap-2">
        <button className="btn btn-danger fw-600" onClick={onConfirm}>
          Delete
        </button>
        <button className="btn-outline-ic w-100 py-2 fw-500" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
