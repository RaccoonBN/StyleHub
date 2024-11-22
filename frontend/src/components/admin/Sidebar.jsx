import React, { useState } from 'react';
import { FaTachometerAlt, FaUser, FaBox, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Nhập Link từ react-router-dom
import './Sidebar.css';
import logo from '../../assets/STYLEHUB.png'; // Đường dẫn đến logo của bạn

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <ul>
        <li>
          <Link 
            to="/dashboard" 
            className={activeMenu === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveMenu('dashboard')}
          >
            <FaTachometerAlt className="sidebar-icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/users" 
            className={activeMenu === 'manageUser' ? 'active' : ''}
            onClick={() => setActiveMenu('manageUser')}
          >
            <FaUser className="sidebar-icon" /> Manage User
          </Link>
        </li>
        <li>
          <Link 
            to="/products" 
            className={activeMenu === 'manageProduct' ? 'active' : ''}
            onClick={() => setActiveMenu('manageProduct')}
          >
            <FaBox className="sidebar-icon" /> Manage Product
          </Link>
        </li>
        <li>
          <Link 
            to="/orders" 
            className={activeMenu === 'manageOrder' ? 'active' : ''}
            onClick={() => setActiveMenu('manageOrder')}
          >
            <FaShoppingCart className="sidebar-icon" /> Manage Order
          </Link>
        </li>
        <li>
          <Link 
            to="/logout" 
            className={activeMenu === 'logout' ? 'active' : ''}
            onClick={() => setActiveMenu('logout')}
          >
            <FaSignOutAlt className="sidebar-icon" /> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
