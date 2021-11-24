import SelectedCard from "../SelectedCard/SelectedCard";
import './InGame.css'
import {useState} from "react";
import {Badge, ProgressBar} from "react-bootstrap";
import {CountdownCircleTimer} from "react-countdown-circle-timer";


function InGameHeader(props) {
    //<h1>ID:{props.gameId}</h1>
    return <div className="in-game-header">

    </div>
}
//<h2 className="scores-header">Score</h2>
function Scores(props) {
    return <div className="scores-container">
        {props.players.map((player,i) => <div key={player.playerId} className="player-score-container">
            <div>{player.playerName} {props.playerAsking === player.id &&
            <Badge bg="secondary">Asking</Badge>}{player.id in props.answers &&
            <Badge bg="primary">Answered</Badge>}</div>
            <div>{player.points}</div>
        </div>)}
    </div>
}

function Answer(props) {
    const [input, setInput] = useState('');

    const handleAnswer = () => {
        props.handleAnswer(input);
        setInput('')
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAnswer();
        }
    }


    return (
        <div className="answer-section">
            <div className="answer-section-inner">
                <SlidingTimer key={props.playerAsking} SlidingTimer {...props}></SlidingTimer>
                <div className="answer-form">
                    {props.playerAsking != props.playerId &&
                    <input
                        className="answer-field"
                        type="text"
                        value={input}
                        placeholder="Enter the answer"
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={(event) => handleKeyPress(event)}
                    />}
                    {props.playerAsking != props.playerId &&
                    <div
                        className="answer-button" onClick={handleAnswer}>Answer
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

function SlidingTimer(props) {

    const [slidingOut, setSlidingOut] = useState(false);
    const [slidingIn, setSlidingIn] = useState(true);
    if(slidingIn){
        setTimeout(()=>setSlidingIn(false), 10)
    }

    const renderTime = ({remainingTime}) => {
        if(!slidingIn) {
            if (props.timeLeft === 0) {
                setSlidingOut(true);
            } else {
                setSlidingOut(false);
            }
        }
        return (
            <div className="timer">
                <div className="value">{Math.ceil(props.timeLeft / 1000)}</div>
            </div>
        );
    };
    return <div className="timer-wrapper">
        <div className={`inner-timer-wrapper ${slidingOut ? "sliding-out" : ""} ${slidingIn ? "sliding-in" : ""}`}>
            <CountdownCircleTimer
                isPlaying
                duration={60}
                initialRemainingTime={props.timeLeft / 1000}
                key={props.timeLeft}
                size={80}
                colors={[["#004777", 0.33], ["#72b94c", 0.33], ["#A30000"]]}
                onComplete={() => [false, 1000]}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    </div>
}


function InGame(props) {
    const state = props.state
    return (<div className="whole-game">
            <InGameHeader gameId={state.gameId}/>

            <div className="in-game-info-container">
                <div className="left-info-container">
                    <h1>Game</h1>
                    <h1>{state.gameId}</h1>
                </div>
                <div className="middle-info-container">
                    <SelectedCard key={state.userAskingId} card={state.currentCard}/></div>
                <div className="right-info-container">
                    <Scores answers={state.answers} players={state.players} playerAsking={state.userAskingId}/>
                </div>
            </div>
            <Answer playerAsking={state.userAskingId} playerId={props.playerId} timeLeft={state.timeLeft}
                    handleAnswer={(e) => props.handleAnswer(e)}>Answer</Answer>
        </div>
    );
}

export default InGame;