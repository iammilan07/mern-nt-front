import React from 'react';
import './Modal.css';

const Modal = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
