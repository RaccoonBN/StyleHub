// src/components/BannerSlide.js
import React from 'react';
import Slider from 'react-slick';
import './bannerslide.css';

const BannerSlide = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Tự động chuyển
    autoplaySpeed: 3000, // Thời gian giữa các lần chuyển (3000 ms)
  };

  return (
    <div className="banner">
      <Slider {...settings}>
        <div>
          <img src={require('../assets/banner1.jpg').default} alt="Banner 1" />
        </div>
        <div>
          <img src={require('../assets/banner2.jpg').default} alt="Banner 2" />
        </div>
        <div>
          <img src={require('../assets/banner3.jpg').default} alt="Banner 3" />
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlide;
