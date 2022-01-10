import SelectedCard from "../SelectedCard/SelectedCard";
import './InGame.css'
import {useState} from "react";
import {Badge, Button, Form, ProgressBar} from "react-bootstrap";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import {Tooltip} from "@mui/material";


function InGameHeader(props) {
    //<h1>ID:{props.gameId}</h1>
    return <div className="in-game-header">

    </div>
}

function getTallyMarks(number) {
    let all = '';
    let fives = Math.floor(number / 5);
    let ones = number % 5;

    for (let i = 0; i < fives; i++) {
        all += '卌 ';
    }
    for (let i = 0; i < ones; i++) {
        all += '|';
    }
    return all.trim();
}


//<h2 className="scores-header">Score</h2>
function Scores(props) {
    return <div className="scores-container">
        {props.players.map((player, i) => <div key={player.playerId} className="player-score-container">
            <div>{player.playerName}{"  "}{props.playerAsking === player.id && '?'}{player.id in props.answers && '✔'}</div>
            <div>{getTallyMarks(player.points)}</div>
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
                    {props.playerAsking != props.playerId && !(Object.entries(props.answers).map(e => e[0]).includes(props.playerId)) &&
                    <input
                        className="answer-field"
                        type="text"
                        value={input}
                        placeholder="Enter the answer"
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={(event) => handleKeyPress(event)}
                    />}
                    {props.playerAsking != props.playerId && !(Object.entries(props.answers).map(e => e[0]).includes(props.playerId)) &&
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
    if (slidingIn) {
        setTimeout(() => setSlidingIn(false), 10)
    }

    const renderTime = ({remainingTime}) => {
        if (!slidingIn) {
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
                size={100}
                colors={[["#9d6714", 0.33]]}
                onComplete={() => [false, 1000]}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    </div>
}

function CardField(props) {
    const state = props.state;
    return <SelectedCard key={state.userAskingId} card={state.currentCard}/>
}

function AnswersShower(props) {
    const [fadingIn, setFadingIn] = useState(true);

    if (fadingIn) {
        setTimeout(() => setFadingIn(false), 10)
    }

    return <Form className={`answer-selector-wrapper ${fadingIn ? "fading-in" : ""} `}>
        <Form.Label>Correct Answer: <b>{props.correctAnswer}</b></Form.Label>
        <Form.Label>Players Answers:</Form.Label>
        {Object.values(props.answers).map((answer, i) =>
            <div key={`default-checkbox${i}`} className="mb-3">
                <Form.Label>- {answer}</Form.Label>
            </div>
        )}
    </Form>
}


function AnswersSelector(props) {
    const [checkboxStates, setCheckboxStates] = useState(Object.values(props.answers).map(ans => false))
    const [fadingOut, setFadingOut] = useState(false);
    const [fadingIn, setFadingIn] = useState(true);

    if (fadingIn) {
        setTimeout(() => setFadingIn(false), 10)
    }

    const handleAnswers = () => {
        const playerIds = Object.entries(props.answers).filter((e, i) => checkboxStates[i]).map(e => e[0])
        console.log(playerIds)
        props.handleAcceptedAnswers(playerIds);
    }

    const handleChange = (e, i) => {
        const newCheckBoxStates = [...checkboxStates]
        newCheckBoxStates[i] = e.target.checked
        setCheckboxStates(newCheckBoxStates)
    }
    return <Form className={`answer-selector-wrapper ${fadingIn ? "fading-in" : ""} `}>
        <Form.Label>Correct Answer: <b>{props.correctAnswer}</b></Form.Label>
        <Form.Label>Select Correct Answers</Form.Label>
        {Object.values(props.answers).map((answer, i) =>
            <div key={`default-checkbox${i}`} className="mb-3">
                <Form.Check
                    type={'checkbox'}
                    id={`default-checkbox${i}`}
                    label={`${answer}`}
                    onChange={e => handleChange(e, i)}
                    checked={checkboxStates[i]}
                />
            </div>
        )}
        <div className={"answer-button submit-button"} onClick={handleAnswers}>
            Submit
        </div>
    </Form>
}


function InGame(props) {
    const state = props.state
    return (<div className="whole-game">
            <InGameHeader gameId={state.gameId}/>

            <div className="in-game-info-container">
                <div className="left-info-container">
                    <Tooltip title={"Copy game link to clipboard"}><Button variant="contained" onClick={() => {
                        navigator.clipboard.writeText("http://localhost:3000/game?gameId=" + state.gameId)
                    }}>ID: {state.gameId}</Button></Tooltip>

                </div>
                <div className="middle-info-container">
                    {state.innerGameState === "ACCEPTING_ANSWERS" && state.userAskingId == props.playerId &&
                    <AnswersSelector correctAnswer={props.state.currentCard.answer}
                                     handleAcceptedAnswers={props.handleAcceptedAnswers}
                                     answers={state.answers}></AnswersSelector>}
                    {state.innerGameState === "ACCEPTING_ANSWERS" && state.userAskingId != props.playerId &&
                    <AnswersShower correctAnswer={props.state.currentCard.answer}
                                   handleAcceptedAnswers={props.handleAcceptedAnswers}
                                   answers={state.answers}></AnswersShower>}
                    <CardField state={state}></CardField>
                </div>
                <div className="right-info-container">
                    <Scores answers={state.answers} players={state.players} playerAsking={state.userAskingId}/>
                </div>
            </div>
            <Answer playerAsking={state.userAskingId} playerId={props.playerId} timeLeft={state.timeLeft}
                    handleAnswer={(e) => props.handleAnswer(e)} answers={state.answers}>Answer</Answer>
        </div>
    );
}

export default InGame;