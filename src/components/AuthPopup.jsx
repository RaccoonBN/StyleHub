// frontend/src/components/AuthPopup.jsx
import React, { useState } from 'react';
import './authPopup.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPopup = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFullname('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        const response = await axios.post('http://localhost:5000/api/login', {
          email,
          password,
        });
        console.log(response); // Ghi lại phản hồi
  
        if (response.status === 200) {
          toast.success('Đăng nhập thành công!');
          onClose();
        } else {
          toast.error(response.data.message || 'Đăng nhập không thành công.');
        }
      } else {
        if (password !== confirmPassword) {
          toast.error('Mật khẩu không khớp. Vui lòng thử lại!');
          return;
        }
  
        const response = await axios.post('http://localhost:5000/api/register', {
          fullname,
          email,
          password,
        });
  
        if (response.status === 201) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          toggleMode();
        } else {
          toast.error(response.data.message || 'Đăng ký không thành công.');
        }
      }
    } catch (error) {
      console.log(error); // Ghi lại lỗi
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };
  

  if (!isOpen) return null;

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
              </div>
            </div>
          )}
          <button type="submit">{isLoginMode ? 'Đăng Nhập' : 'Đăng Ký'}</button>
          <p onClick={toggleMode}>
            {isLoginMode ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Bạn đã có tài khoản? Đăng nhập'}
          </p>
        </form>
        <ToastContainer />
        <button className="close-popup" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default AuthPopup;
