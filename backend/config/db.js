var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Thay đổi nếu cần
    password: '',           // Mật khẩu, thay đổi nếu có
    database: 'stylehub'    // Tên cơ sở dữ liệu
});

// Kết nối đến MySQL
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Kết nối thành công tới MySQL!');
});

module.exports = db;
