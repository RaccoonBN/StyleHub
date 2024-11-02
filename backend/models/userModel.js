const db = require('../config/db');

// Hàm thêm người dùng mới
const createUser = (firstName, lastName, email, password, callback) => {
    const sql = 'INSERT INTO account (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, password], callback);
};

// Hàm tìm người dùng theo email
const findUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM account WHERE email = ?';
    db.query(sql, [email], callback);
};

module.exports = { createUser, findUserByEmail };
