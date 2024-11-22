import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import axios from 'axios'; 

const ManageUser = () => {
  const [accounts, setAccounts] = useState([]); 

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users'); 
        console.log(response.data); // Kiểm tra data nhận được
        setAccounts(response.data); // Cập nhật state accounts
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/users/${id}`); 
      setAccounts(accounts.filter(account => account.acc_id !== id)); // Thay đổi id thành acc_id
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="manage-user-content">
        {/* ... (code UI) ... */}
        <table>
          <thead>
            <tr>
              <th>Last Name</th> 
              <th>First Name</th>
              <th>Email</th>
              <th>Total Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => ( 
              <tr key={account.acc_id}> 
                <td>{account.last_name}</td>  
                <td>{account.first_name}</td>
                <td>{account.email}</td>
                <td>{account.totalOrders}</td>
                <td>
                  <button onClick={() => deleteUser(account.acc_id)}>Delete</button> 
                  {/* ... (nút Sửa) ... */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ... (code UI) ... */}
      </div>
    </div>
  );
};

export default ManageUser;