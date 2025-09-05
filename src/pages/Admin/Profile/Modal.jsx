import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import './Modal.css';

export default function Modal({ title, message, onClose, onAction, actionLabel, children }) {
  if (!title && !message && !children) {
    return null; // Don't render if there's no content
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          {message && <p>{message}</p>}
          {children}
        </div>
        <div className="modal-footer">
          {onAction && (
            <button className="btn" onClick={onAction}>
              {actionLabel || 'OK'}
            </button>
          )}
          <button className="btn btn--light" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}