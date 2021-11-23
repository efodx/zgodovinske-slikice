import './SelectedCard.css'
import stalin from '../staljin.jpg'
import {useState} from "react";

function SelectedCard(props) {
    const [turned, setTurned] = useState(false)
    const [fading, setFading] = useState(true)

    const card = props.card;
    if (card.image == undefined) {
        card.image = stalin;
    }else{
        card.image = 'http://localhost:8080/images/'+card.imageId
    }
    if (fading) {
        setTimeout(() => setFading(false), 1000);
    } else {
        setTimeout(() => setTurned(true), 1000)
    }

    return <div className={`flip-card ${turned ? "back-side" : "front-side"} ${fading ? "fading" : "full"}`}>
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