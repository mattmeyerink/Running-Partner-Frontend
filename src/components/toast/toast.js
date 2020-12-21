import React, {useState, useEffect} from 'react';
import './toast.css';

const Toast = (props) => {
    const { title, message, position, backgroundColor } = props;
    return (
        <div className={`notification-container ${position}`}>
            <div className={`nofitication toast ${position}`} style={{ backgroundColor: backgroundColor}}>
                <button>
                    x
                </button>
                <div>
                    <p className="notification-title">{title}</p>
                    <p className="notification-message">{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Toast;
