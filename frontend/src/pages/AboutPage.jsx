// AboutPage.js
import React from 'react';
import FounderCard from '../components/FounderCard'; // Import component FounderCard
import './AboutPage.css'; // Đảm bảo rằng bạn có file CSS để định dạng trang

const About = () => {
    const founders = [
        {
            name: 'Trần Đại Nghĩa',
            position: 'CO-FOUNDER',
            image: require('../assets/founder2.png') // Sử dụng require để nhúng ảnh
        },
        {
            name: 'Tạ Hà Quỳnh Anh',
            position: 'CO-FOUNDER',
            image: require('../assets/founder1.png') // Sử dụng require để nhúng ảnh
        },
        {
            name: 'Trần Huỳnh Bảo Ngọc',
            position: 'CO-FOUNDER',
            image: require('../assets/founder1.png') // Sử dụng require để nhúng ảnh
        },
        {
            name: 'Phạm Trương Tuấn Ninh',
            position: 'CO-FOUNDER',
            image: require('../assets/founder2.png') // Sử dụng require để nhúng ảnh
        },
        {
            name: 'Nguyễn Hoàng Trung Nguyên',
            position: 'CO-FOUNDER',
            image: require('../assets/founder2.png') // Sử dụng require để nhúng ảnh
        }
    ];

    return (
        <div className="about-page">
            <h2 className="about-title">Đội Ngũ Sáng Lập</h2> {/* Thay đổi className cho h2 */}
            <div className="founder-cards">
                {founders.map((founder, index) => (
                    <FounderCard 
                        key={index} 
                        name={founder.name} 
                        position={founder.position} 
                        image={founder.image} 
                    />
                ))}
            </div>
        </div>
    );
};

export default About;
