// FounderCard.js
import React from 'react';
import './FounderCard.css'; // Đảm bảo bạn có file CSS để định dạng card

const FounderCard = ({ name, position, image }) => {
    return (
        <div className="founder-card">
            <img src={image} alt={name} className="founder-image" />
            <h3 className="about">{name}</h3>
            <p className="about">{position}</p>
        </div>
    );
};

export default FounderCard;
