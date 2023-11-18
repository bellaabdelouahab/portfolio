import "../assets/css/experience_carousel/index.scss";

const images = [
  "http://localhost:5000/x.png",
  "http://localhost:5000/code.png",
  "http://localhost:5000/x.png",
  "http://localhost:5000/x.png",
];

export default function ExperienceCarousel() {
  return (
    <div className="carousel-wrapper">
      <div className="ex-carousel">
        {images.map((image, index) => (
          <div className="carousel__item" key={index}>
            <div className="carousel__item-body">
              <img src={image} className="carousel-img" alt="carousel" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}