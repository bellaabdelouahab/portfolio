export default function CarouselForm({carouselSamples, setCarouselSamples, setPopupWindow}) {
      const handleCarouselSubmit = () => {
        let temp = [...carouselSamples];
        temp.push({
          title: document.querySelector(".carouselSampleTitle").value,
          img: document.querySelector(".image_carussel").files,
        });
        setCarouselSamples(temp);
        setPopupWindow(null);
      };
  return (
    <div className="popup-container">
      <div className="popup">
        <p onClick={() => setPopupWindow(null)}>X</p>
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
  );
}