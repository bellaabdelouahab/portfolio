export default function CarouselForm({setCarouselleWindow, handleCarouselSubmit}) {
    return (
        <div className="popup-container">
                    <div className="popup">
                        <p onClick={() => setCarouselleWindow(false)}>X</p>
                        <input
                            type="text"
                            className="carouselSampleTitle"
                            name="carouselSampleTitle"
                            placeholder="carousel Sample Title"
                        />

                        <input
                            type="file"
                            className="image_carussel"
                            accept="image/jpeg,image/jpg,image/png"
                            name="image"
                        />

                        <button onClick={handleCarouselSubmit}>Submit</button>
                    </div>
                </div>
    )
}