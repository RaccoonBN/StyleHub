import React, { useState } from 'react';
import './authPopup.css'; // Nhập CSS cho pop-up
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa'; // Nhập icon
import axios from 'axios'; // Nhập Axios để gửi yêu cầu HTTP
import { ToastContainer, toast } from 'react-toastify'; // Nhập ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho Toast

const AuthPopup = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Xác định chế độ hiện tại
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Để hiển thị mật khẩu

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode); // Chuyển đổi giữa đăng nhập và đăng ký
    setFullname(''); // Đặt lại trường họ tên khi chuyển sang chế độ đăng nhập
    setEmail(''); // Đặt lại trường email
    setPassword(''); // Đặt lại trường mật khẩu
    setConfirmPassword(''); // Đặt lại trường xác nhận mật khẩu
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form tự động reload
    try {
      if (isLoginMode) {
        // Xử lý đăng nhập
        const response = await axios.post('/api/login', {
          email,
          password,
        });
        // Hiển thị thông báo thành công và đóng pop-up nếu đăng nhập thành công
        toast.success('Đăng nhập thành công!');
        onClose();
      } else {
        // Kiểm tra mật khẩu và mật khẩu xác nhận có khớp không
        if (password !== confirmPassword) {
          toast.error('Mật khẩu không khớp. Vui lòng thử lại!');
          return;
        }
        // Xử lý đăng ký
        const response = await axios.post('/api/register', {
          fullname,
          email,
          password,
        });
        // Hiển thị thông báo thành công và chuyển sang chế độ đăng nhập
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        toggleMode();
      }
    } catch (error) {
      // Xử lý lỗi từ server hoặc lỗi kết nối
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
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
      <ToastContainer 
          style={{ zIndex: 2000, marginTop: '40px' }} 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false} 
          closeOnClick={true} 
          pauseOnHover={true} 
          draggable={true} 
          progress={undefined} 
      />
    </div>
  );
};

export default AuthPopup;
