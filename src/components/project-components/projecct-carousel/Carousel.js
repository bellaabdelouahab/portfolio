
import {useEffect} from 'react';
import './carousel-wide-screen.css'
export default function Carousel({ carouselImages}) {
  return (
    <div className="carousel-container">
      <div className="big-image">
        <div className="overlay">
          dfjsdfjkds
        </div>
      </div>
      <div className='carousel-preview-container'>
        <img className="carousel-nav" src="https://via.placeholder.com/75" alt="Picture Not Loaded" />
        <div className="carousel-preview">
          <img className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
        </div>
        <img className="carousel-nav" src="https://via.placeholder.com/75" alt="Picture Not Loaded" />
      </div>
    </div>
  );
}