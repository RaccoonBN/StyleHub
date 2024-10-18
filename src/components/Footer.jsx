// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Nhập CSS cho footer
import logo from '../assets/logo.png'; // Đường dẫn đến logo

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
      <img src={logo} alt="StyleHub Logo" className="footer-logo" /> {/* Hiển thị logo */}
      </div>
      <div className="footer-content">
      <div className="footer-slogan">
          <h3>Khám phá phong cách của bạn tại StyleHub!</h3> {/* Câu slogan */}
        </div>
        <div className="footer-contact">
          <h3>Liên hệ</h3>
          <p><strong>Service Hotline tư vấn & mua hàng: </strong>0703060629</p>
          <p><strong>Góp ý & Khiếu nại:</strong> 0975078344 - 0977776061</p>
          <p><strong>Email: </strong>stylehub@gmail.com</p>
          <p><strong>Địa chỉ:</strong> 18A/1 Cộng Hòa, P.4, Q. Tân Bình, TP.HCM, VN.</p>
        </div>
      </div>
      <p className="footer-rights">&copy; {new Date().getFullYear()} StyleHub.</p>
    </footer>
  );
};

export default Footer;
