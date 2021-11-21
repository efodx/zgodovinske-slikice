import SelectedCard from "../SelectedCard/SelectedCard";
import './InGame.css'
import {useState} from "react";
import {Badge, ProgressBar} from "react-bootstrap";

function InGameHeader(props) {
    return <div className="in-game-header">
        <h1>ID:{props.gameId}</h1>
    </div>
}

function Scores(props) {
    return <div className="scores-container">
        <h2 className="scores-header">Score</h2>
        {props.players.map(player => <div className="player-score-container">
            <div>{player.playerName} {props.playerAsking === player.id && <Badge bg="secondary">Asking</Badge>}{player.id in props.answers &&<Badge bg="primary">Answered</Badge>}</div>
            <div>{player.points}</div>
        </div>)}
    </div>
}

function Answer(props) {
    const [input, setInput] = useState('');

    const handleAnswer = () =>{
        props.handleAnswer(input);
        setInput('')
    }
    const handleKeyPress = (event) =>{
        if(event.key === 'Enter'){
            handleAnswer();
        }
    }

    return (
        <div className="answer-section">
            <div className="answer-section-inner">
                <ProgressBar  max={60000} now={props.timeLeft}/>
                {props.playerAsking != props.playerId &&
                <input
                    className="answer-field"
                    type="text"
                    value={input}
                    placeholder="Enter the answer"
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={(event)=>handleKeyPress(event)}
                />}
                {props.playerAsking != props.playerId &&
                <div
                    className="answer-button" onClick={handleAnswer}>Answer
                </div>
                }
            </div>
        </div>
    )
}

function InGame(props) {
    const state = props.state
    return (<div className="whole-game">
            <InGameHeader gameId={state.gameId}/>

            <div className="in-game-info-container">
                <div className="left-info-container">
                    <div>Current Player Asking = {state.userAskingId}</div>
                </div>
                <div className="middle-info-container"><SelectedCard card={state.currentCard}/></div>
                <div className="right-info-container">
                    <Scores answers={state.answers} players={state.players} playerAsking={state.userAskingId}/>
                </div>
            </div>
            <Answer playerAsking={state.userAskingId} playerId={props.playerId} timeLeft={state.timeLeft} handleAnswer={(e) => props.handleAnswer(e)}>Answer</Answer>
        </div>
    );
}

export default InGame;