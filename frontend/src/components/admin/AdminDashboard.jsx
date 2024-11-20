import React from 'react';
import { FaClipboard, FaUsers, FaDollarSign } from 'react-icons/fa';
import './AdminDashboard.css';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminDashboard = () => {
  return (
    <Header>
      <Sidebar>
        <div className="admin-dashboard-container">
          <main className="admin-dashboard-main">
            <div className="admin-dashboard-cards">
              <div className="admin-dashboard-card admin-dashboard-card-orders">
                <FaClipboard className="admin-dashboard-icon" />
                <div>
                  <h3>120</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="admin-dashboard-card admin-dashboard-card-users">
                <FaUsers className="admin-dashboard-icon" />
                <div>
                  <h3>1,200</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="admin-dashboard-card admin-dashboard-card-income">
                <FaDollarSign className="admin-dashboard-icon" />
                <div>
                  <h3>$35,000</h3>
                  <p>Total Income</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Sidebar>
    </Header>
  );
};

export default AdminDashboard;
