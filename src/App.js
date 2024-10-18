import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage'; 
import About from './pages/AboutPage'; 
import Footer from './components/Footer'; // Nhập Footer
import Navbar from './components/Navbar'; // Nhập Navbar

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* Hiển thị Navbar trên tất cả các trang */}
        <Routes>
          {/* Đường dẫn mặc định luôn là trang chủ */}
          <Route path="/" element={<Home />} />
          {/* Thêm route cho trang "Về Chúng Tôi" */}
          <Route path="/about" element={<About />} />
          {/* Bạn có thể thêm các route khác ở đây */}
        </Routes>
        <Footer /> {/* Hiển thị Footer trên tất cả các trang */}
      </div>
    </Router>
  );
}

export default App;
