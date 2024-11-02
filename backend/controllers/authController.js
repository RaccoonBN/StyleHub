const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'Nhom15tmdt';

// Đăng ký người dùng mới
exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Log thông tin đầu vào
    console.log('Register Request:', { firstName, lastName, email });

    if (!firstName || !lastName || !email || !password) {
        console.error('Thiếu thông tin đăng ký:', { firstName, lastName, email, password });
        return res.status(400).json({ error: 'Thiếu thông tin' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    userModel.createUser(firstName, lastName, email, hashedPassword, (err, result) => {
        if (err) {
            console.error('Lỗi khi tạo người dùng:', err);
            return res.status(500).json({ error: 'Email đã tồn tại' });
        }
        console.log('Đăng ký thành công cho người dùng:', email);
        res.status(201).json({ message: 'Đăng ký thành công' });
    });
};

// Đăng nhập người dùng
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Log thông tin đầu vào
    console.log('Login Request:', { email });

    userModel.findUserByEmail(email, async (err, results) => {
        if (err || results.length === 0) {
            console.error('Email không tồn tại hoặc lỗi:', { email, err });
            return res.status(400).json({ error: 'Email không tồn tại' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.error('Mật khẩu không đúng cho người dùng:', email);
            return res.status(400).json({ error: 'Mật khẩu không đúng' });
        }

        const token = jwt.sign({ id: user.acc_id }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Đăng nhập thành công cho người dùng:', email);
        res.json({ message: 'Đăng nhập thành công', token });
    });
};
