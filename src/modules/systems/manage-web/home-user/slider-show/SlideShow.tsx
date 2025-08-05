'use client';

import React from 'react';
import SliderLib from 'react-slick';
const Slider = SliderLib as unknown as React.ComponentType<any>;
import { Card, Typography } from 'antd';
import styles from './sliderShowSection.module.scss';

const images = [
  '/Slider/slider1.png',
  '/Slider/slider2.jpg',
  '/Slider/slider3.jpg',
];
const { Title } = Typography;

const SliderShowSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className={styles.container}>
      {/* Slider */}
      <div className={styles.sliderSection}>
        <Slider {...settings} className={styles.customSlider}>
          {images.map((url, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={url}
                alt={`Chemistry slide ${index + 1}`}
                className={styles.sliderImage}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* About */}
      <div className={styles.aboutSection}>
        <Card bordered={true} className={styles.aboutCard}>
          <Title level={2} className={styles.sectionTitle}>
            {`VỀ CHÚNG TÔI`}
          </Title>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImage}>
              <img src="/about1.jpg" alt="About chemistry" />
            </div>
            <div className={styles.aboutText}>
              <p>
                Diễn đàn hóa hóa ( Chemistry Forum ) là nền tảng thiết lập nhằm
                cung cấp tư liệu dưới nhiều hình thức đa dạng dành cho học sinh
                THPT. Nội dung chính gồm: Lý thuyết các bài học; bộ câu hỏi trắc
                nghiệm phục vụ cho việc ôn tập kiến thức và những trò chơi bổ
                ích, thú vị dễ dàng tiếp cận với nhiều đối tượng học sinh. Với
                sự trợ giúp của đội ngũ giáo viên dày dặn kinh nghiệm, mọi bài
                tập trên website đều được kiểm định một cách nghiêm ngặt và độ
                chính xác gần như là tuyệt đối.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SliderShowSection;
