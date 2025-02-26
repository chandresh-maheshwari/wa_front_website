import React from 'react';
import './Popup.css'; // Optional: Add your styles

const Popup = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button onClick={onClose}>Close</button>
                {children}
            </div>
        </div>
    );
};

export default Popup;
