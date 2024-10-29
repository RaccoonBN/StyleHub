// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            alert('Đăng nhập thành công! Token: ' + response.data.token);
            setUsername('');
            setPassword('');
        } catch (error) {
            setError('Đăng nhập thất bại: ' + error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Hiện thông báo lỗi */}
            <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Đăng nhập</button>
        </form>
    );
};

export default Login;
