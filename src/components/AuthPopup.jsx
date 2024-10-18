// src/components/AuthPopup.js
import React, { useState } from 'react';
import './authPopup.css'; // Nhập CSS cho pop-up
import { FaEnvelope, FaLock, FaEye, FaEyeSlash,FaUser } from 'react-icons/fa'; // Nhập icon

const AuthPopup = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Xác định chế độ hiện tại

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Để hiển thị mật khẩu

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      // Xử lý đăng nhập
      console.log('Đăng nhập với:', { email, password });
    } else {
      // Xử lý đăng ký
      console.log('Đăng ký với:', { fullname, email, password, confirmPassword });
    }
    onClose(); // Đóng pop-up sau khi thực hiện
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode); // Chuyển đổi giữa đăng nhập và đăng ký
  };

  if (!isOpen) return null; // Nếu pop-up không mở thì không hiển thị gì

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup">
        <h2>{isLoginMode ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="fullname">Họ tên</label>
              <div className="input-with-icon">
              <FaUser className="input-icon" />
                <input
                  type="text"
                  id="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password-visibility" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirm-password">Nhập lại mật khẩu</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="toggle-password-visibility" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          )}
          <button type="submit">{isLoginMode ? 'Đăng Nhập' : 'Đăng Ký'}</button>
        </form>
        <p>
          {isLoginMode ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <span onClick={toggleMode} className="toggle-link">
            {isLoginMode ? 'Đăng Ký' : 'Đăng Nhập'}
          </span>
        </p>
        <button className="close-popup" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default AuthPopup;
