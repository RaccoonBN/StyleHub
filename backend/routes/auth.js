const express = require('express');
const connection = require('../config/db');
const router = express.Router();

// Đăng ký người dùng
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const checkEmailQuery = 'SELECT * FROM account WHERE email = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const createUserQuery = 'INSERT INTO account (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    connection.query(createUserQuery, [firstName, lastName, email, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
      }
      res.status(201).json({ message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
    });
  });
});

// Đăng nhập người dùng
router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Tìm người dùng theo email
    const findUserByEmail = 'SELECT * FROM account WHERE email = ?';
    connection.query(findUserByEmail, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại!' });
      }
  
      // Kiểm tra nếu không tìm thấy người dùng với email này
      if (results.length === 0) {
        return res.status(400).json({ message: 'Email không tồn tại' });
      }
  
      const user = results[0];
  
      // So sánh mật khẩu nhập vào với mật khẩu trong cơ sở dữ liệu
      if (password !== user.password) {
        return res.status(400).json({ message: 'Mật khẩu không đúng' });
      }
  
      // Lưu thông tin người dùng vào session
      req.session.user = {
        id: user.acc_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };
        res.status(200).json({
        message: 'Đăng nhập thành công',
        acc_id: user.acc_id , // Trả về acc_id để frontend có thể lưu vào localStorage
        user: req.session.user,
      });
    });
  });

// Đăng xuất người dùng (xóa session)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Đã có lỗi xảy ra khi đăng xuất.' });
    }
    res.status(200).json({ message: 'Đăng xuất thành công.' });
  });
});

module.exports = router;
