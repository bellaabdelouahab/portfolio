import '../assets/css/carsual.css'

export default function Carousel({ carouselImages}) {
    console.log("carouselImages", carouselImages);
    return (
      <div className="carousel">
        <form className="carousel-form">
            {carouselImages && carouselImages.length > 0 && carouselImages.map((image, index) => {
                return (
                  <div key={index}>
                    <input
                      type="radio"
                      name="fancy"
                      autoFocus
                      value="clubs"
                      id="clubs"
                    />
                    <label
                      className="carousel-label"
                      htmlFor="clubs"
                      style={{
                        background: `url(http://localhost:5000/${image.img})`,
                      }}
                    >
                      &#9827; Clubs
                    </label>
                  </div>
                );
            })}
          {/* <input type="radio" name="fancy" autoFocus value="clubs" id="clubs" />
            <input type="radio" name="fancy" value="hearts" id="hearts" />
            <input type="radio" name="fancy" value="spades" id="spades" />
            <input type="radio" name="fancy" value="diamonds" id="diamonds" />			 */}
          {/* <label className='carousel-label' htmlFor="clubs">&#9827; Clubs</label>
            <label className='carousel-label' htmlFor="hearts">&#9829; Hearts</label>
            <label className='carousel-label' htmlFor="spades">&#9824; Spades</label>
            <label className='carousel-label' htmlFor="diamonds">&#9830; Diamonds</label> */}
          <div className="keys">Use left and right keys to navigate</div>
        </form>
      </div>
    );
}