import '../assets/css/carsual.css'

export default function Carousel() {
    return (
        <div className="carousel">
        <form className='carousel-form'>
            <input type="radio" name="fancy" autofocus value="clubs" id="clubs" />
            <input type="radio" name="fancy" value="hearts" id="hearts" />
            <input type="radio" name="fancy" value="spades" id="spades" />
            <input type="radio" name="fancy" value="diamonds" id="diamonds" />			
            <label className='carousel-label' for="clubs">&#9827; Clubs</label>
            <label className='carousel-label' for="hearts">&#9829; Hearts</label>
            <label className='carousel-label' for="spades">&#9824; Spades</label>
            <label className='carousel-label' for="diamonds">&#9830; Diamonds</label>
            <div class="keys">Use left and right keys to navigate</div>
        </form>
        </div>
        )
}