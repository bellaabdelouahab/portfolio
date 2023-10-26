
import { useEffect } from "react";
import "../assets/css/experience_carousel/index.scss";


export default function ExperienceCarousel() {
  const images = [
    "http://localhost:5000/x.png",
    "http://localhost:5000/code.png",
    "http://localhost:5000/x.png",
    "http://localhost:5000/x.png",
  ];
  
  useEffect(()=>{
    const element = document.querySelector(".ex-carousel");
    const root = document.documentElement;
    element.addEventListener('mouseover', function() {
      // root.style.setProperty("--animation-timing","1s");
      console.log("dfsdfsdfds");
    })
  },[])

  return (
    <>
      <div
        className="wrapper"
        style={{ width: "400px", height: "250px", overflow: "" }}
      >
        <div className="ex-carousel">
          {images.map((image) => {
            return (
              <div className="carousel__item" key={image} style={{}}>
                {/* pass image as param */}
                <div
                  class="carousel__item-head"
                  style={{
                    position: "absolute",
                    top: "50px",
                    left: "-25px",
                    width: "min-content",
                    height: "min-content",
                    height: "100px",
                    width: "100px",
                    borderRadius: "15%",
                    background: "url(http://localhost:5000/download.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
                <div className="carousel__item-body">
                  <img
                    src={image}
                    className="carousel-img"
                    alt="carousel"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}