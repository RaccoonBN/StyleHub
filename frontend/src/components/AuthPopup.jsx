import React, { useState } from 'react';
import './authPopup.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPopup = ({ isOpen, onClose, onLogout }) => {
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
    console.log('Form Data:', { fullname, email, password, confirmPassword, isLoginMode });
  
    // Kiểm tra trước khi gửi yêu cầu đăng nhập/đăng ký
    if (!email || !password || (isLoginMode && !password)) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }
  
    try {
      // Đăng nhập
      if (isLoginMode) {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('acc_id', response.data.acc_id); // Lưu acc_id vào localStorage
          toast.success('Đăng nhập thành công!');
          onClose(); // Đóng modal sau khi đăng nhập thành công
        } else {
          toast.error(response.data.message || 'Đăng nhập không thành công.');
        }
      } else {
        // Đăng ký
        if (password !== confirmPassword) {
          toast.error('Mật khẩu không khớp. Vui lòng thử lại!');
          return;
        }
  
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          firstName: fullname.split(' ')[0],
          lastName: fullname.split(' ').slice(1).join(' '),
          email,
          password,
        });
  
        if (response.status === 201) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          toggleMode(); // Chuyển sang chế độ đăng nhập
        } else {
          toast.error(response.data.message || 'Đăng ký không thành công.');
        }
      }
    } catch (error) {
      console.log('Error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  if (!isOpen) return null; // Không hiển thị form nếu modal không mở
  

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup-container">
        <h2>{isLoginMode ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="auth-popup-form-group">
              <label htmlFor="fullname">Họ tên</label>
              <div className="auth-popup-input-with-icon">
                <FaUser className="auth-popup-input-icon" />
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
          <div className="auth-popup-form-group">
            <label htmlFor="email">Email</label>
            <div className="auth-popup-input-with-icon">
              <FaEnvelope className="auth-popup-input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="auth-popup-form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="auth-popup-input-with-icon">
              <FaLock className="auth-popup-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="auth-popup-toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          {!isLoginMode && (
            <div className="auth-popup-form-group">
              <label htmlFor="confirm-password">Nhập lại mật khẩu</label>
              <div className="auth-popup-input-with-icon">
                <FaLock className="auth-popup-input-icon" />
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
          <button type="submit" className="auth-popup-submit-btn">
            {isLoginMode ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
          <p className="auth-popup-toggle-mode" onClick={toggleMode}>
            {isLoginMode ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Bạn đã có tài khoản? Đăng nhập'}
          </p>
        </form>
        <ToastContainer />
        <button className="auth-popup-close-icon" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
