// FounderCard.js
import React from 'react';
import './FounderCard.css'; // Đảm bảo bạn có file CSS để định dạng card

const FounderCard = ({ name, position, image }) => {
    return (
        <div className="founder-card">
            <img src={image} alt={name} className="founder-image" />
            <h3>{name}</h3>
            <p>{position}</p>
        </div>
    );
};

export default FounderCard;
