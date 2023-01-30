import '../assets/css/carsual.css'

export default function Carousel() {
    return (
        <div className="carousel">
        <form className='carousel-form'>
            <input type="radio" name="fancy" autoFocus value="clubs" id="clubs" />
            <input type="radio" name="fancy" value="hearts" id="hearts" />
            <input type="radio" name="fancy" value="spades" id="spades" />
            <input type="radio" name="fancy" value="diamonds" id="diamonds" />			
            <label className='carousel-label' htmlFor="clubs">&#9827; Clubs</label>
            <label className='carousel-label' htmlFor="hearts">&#9829; Hearts</label>
            <label className='carousel-label' htmlFor="spades">&#9824; Spades</label>
            <label className='carousel-label' htmlFor="diamonds">&#9830; Diamonds</label>
            <div className="keys">Use left and right keys to navigate</div>
        </form>
        </div>
        )
}