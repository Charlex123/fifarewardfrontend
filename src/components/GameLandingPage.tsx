// components/ImageSlider.tsx
import React, { useState, useEffect } from 'react';
import styles from '../styles/gamelandingpage.module.css';
import logo from '../assets/images/aibg.png';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
}

const GameLandingPage: React.FC<ImageSliderProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {logo},
    {logo},
    {logo}, // Add paths to your images here
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.sliderContainer}>
      <div
        className={styles.sliderWrapper}
        style={{ transform: `translateX(-${currentIndex * 250}px)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={styles.slide}
            style={{ backgroundImage: `url(${image})` }}
          >
            <Image src={image} alt='slider' width={250} height={250} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLandingPage;
