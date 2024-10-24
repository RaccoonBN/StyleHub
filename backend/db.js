const mysql = require('mysql2');

// Tạo kết nối với MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Tên người dùng MySQL
  password: '',         // Mật khẩu MySQL
  database: 'stylehub'  // Tên cơ sở dữ liệu
});

// Kết nối tới MySQL
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('Kết nối thành công tới MySQL!');
});

module.exports = db; 
