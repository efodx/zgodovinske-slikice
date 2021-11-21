import './SelectedCard.css'
import  stalin from '../staljin.jpg'

function SelectedCard(props) {
    const card = props.card;
    if(card.image == undefined){
        card.image = stalin;
    }

    return <div className="flip-card">
        <div className="flip-card-inner">
            <div className="flip-card-front">
                <img className="selected-card-image" src={card.image}/>
                <div className="question-wrapper"><p>{card.question}</p></div>
            </div>
            <div className="flip-card-back">
            </div>
        </div>
    </div>
}

export default SelectedCard