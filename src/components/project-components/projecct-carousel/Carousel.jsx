
import { useEffect, useState } from 'react';
import './carousel-wide-screen.css';
const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

export default function Carousel({ carouselImages }) {
  const [currentPic, setCurrentPic] = useState(0);

  useEffect(() => {
    if (!carouselImages || carouselImages.length === 0) return ;
    const bigImage = document.querySelector('.big-image');
    const picPreviews = document.querySelectorAll('.pic-preview');
    const overlay = document.querySelector('.overlay');
    const carouselNavLeft = document.querySelector('.carousel-nav-left');
    const carouselNavRight = document.querySelector('.carousel-nav-right');

    const pics = [...picPreviews];

    carouselNavLeft.addEventListener('click', () => {
      const newImageIndex = currentPic === 0 ? carouselImages.length - 1 : currentPic - 1;
      console.log(newImageIndex);
      setCurrentPic(newImageIndex);
      changePic(newImageIndex);
    });

    carouselNavRight.addEventListener('click', () => {
      const newImageIndex = currentPic === carouselImages.length - 1 ? 0 : currentPic + 1;
      setCurrentPic(newImageIndex);
      changePic(newImageIndex);
    });
    
    function changePic(currentPic) {
      console.log("currentPic", carouselImages[currentPic]);
      bigImage.style.background = `url(${backendUploadsApi}/${carouselImages[currentPic].img}) no-repeat center center` ;
      overlay.innerHTML = `
      <div class="overlay-content">
      <p class="overlay-content__description">${carouselImages[currentPic].title}</p>
      </div>
      `;
      pics.forEach((pic, index) => {
        pic.classList.toggle('active', index === currentPic);
      });
    }
    
    changePic(currentPic);
    
    picPreviews.forEach((pic, index) => {
      pic.addEventListener('click', () => {
        setCurrentPic(index);
      });
    });

    return () => {
      picPreviews.forEach((pic, index) => {
        pic.removeEventListener('click', () => {
          setCurrentPic(index);
        });
      });
    };
  }, [currentPic,carouselImages]);
  
  if (!carouselImages || carouselImages.length === 0) return null;

  return (
    <div className="carousel-container">
      <div className="big-image">
        <div className="overlay">
        </div>
      </div>
      <div className='carousel-preview-container'>
        <img className="carousel-nav-left" src="../icons/left-arrow.png" alt="Not Loaded" />
        <div className="carousel-preview">
          {carouselImages.map((elem, index) => (
            <img
              key={index}
              className={`pic-preview ${index === currentPic ? 'active' : ''}`}
              src={`${backendUploadsApi}/${elem.img}`}
              alt="Not Loaded"
              onClick={() => setCurrentPic(index)}
            />
          ))}
          {/* <img key={0} className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img key={1} className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img key={2} className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img key={3} className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img key={4} className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" />
          <img key={5} className="pic-preview" src="https://via.placeholder.com/100" alt="Picture Not Loaded" /> */}
        </div>
        <img className="carousel-nav-right" src="../icons/left-arrow.png" alt="Not Loaded" style={{ transform: 'rotate(180deg)' }} />
      </div>
    </div>
  );
}