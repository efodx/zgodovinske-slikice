import {useEffect, useState} from "react";
import axios from 'axios'
import Lobby from "./Lobby";
import InGame from "./InGame/InGame";


function Game(props) {
    const [state, setState] = useState(null);

    useEffect( () => {
            const timeout = setTimeout(fetchGameData,1000);
            return () => clearTimeout(timeout);
    })

    const fetchGameData =  () => {
        axios.get('http://localhost:8080/game/' + props.gameId).then(data=>setState(data.data))
    }

    const handleStartGame = async () => {
        await axios.get('http://localhost:8080/game/' + props.gameId + '/start').catch(p=>p);
        const gameState = await axios.get('http://localhost:8080/game/' + props.gameId);
        setState(gameState.data);
    }
    const handleAddCard = async () => {
        await axios.post('http://localhost:8080/game/' + props.gameId + '/addCard', {},
            {
                params: {playerId: props.playerId, answer: "SOME ANSWER BOY"}
            }
        );
    }
    const handleAnswer = async (answer) => {
        await axios.post('http://localhost:8080/game/' + props.gameId + '/answer', {},
            {
                params: {playerId: props.playerId, answer: answer}
            }
        );
    }


    const renderGame = () => {
        if (state != null) {
            if(state.gameState === "LOBBY"){
                return <Lobby gameState={state} playerId={props.playerId} handleAddCard={handleAddCard} handleOnClick={handleStartGame}/>
            }
            return <InGame playerId={props.playerId} state={state} handleAnswer={handleAnswer}/>
        }else{
            return <div> LOADING...</div>
        }
    }

    return (renderGame()
    )

}
function Card(props) {
    const card = props.card;
    return <div>
        {card.question}?
        {card.answer}

    </div>
}
export default Game;