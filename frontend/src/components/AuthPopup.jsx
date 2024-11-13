import React, { useState, useEffect } from 'react';
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

  // Kiểm tra xem người dùng đã đăng nhập hay chưa bằng cách xem token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast.success('Đã đăng nhập thành công!');
      onClose(); 
    }
  }, [onClose]);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFullname(''); 
    setEmail('');
    setPassword(''); 
    setConfirmPassword(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', { fullname, email, password, confirmPassword, isLoginMode }); // Log dữ liệu gửi đi

    try {
      if (isLoginMode) {
        const response = await axios.post('http://localhost:5000/api/login', {
          email,
          password,
        });

        console.log('Login Response:', response); // Log phản hồi từ server

        if (response.status === 200) {
          // Lưu token và thông tin người dùng vào localStorage (nếu có)
          localStorage.setItem('token', response.data.token); // Lưu token nếu server trả về
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin người dùng vào localStorage

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
          firstName: fullname.split(" ")[0], // Lấy tên
          lastName: fullname.split(" ")[1],   // Lấy họ
          email,
          password,
        });

        console.log('Register Response:', response); // Log phản hồi từ server

        if (response.status === 201) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          toggleMode(); // Chuyển sang chế độ đăng nhập
        } else {
          toast.error(response.data.message || 'Đăng ký không thành công.');
        }
      }
    } catch (error) {
      console.log('Error:', error); // Log lỗi
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
