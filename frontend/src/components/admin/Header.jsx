import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import './Header.css'; 

const Header = () => {
    return (
        <div>
            <nav>
                <a href="#" className="nav-link">STYLEHUB | ADMIN</a>
                <a href="#" className="profile">
                    <FaUserCircle size="2em" /> {/* Icon user */}
                </a>
            </nav>
        </div>
    );
}

export default Header;
