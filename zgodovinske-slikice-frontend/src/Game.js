import React, {useEffect, useMemo, useState} from "react";
import axios from 'axios'
import Lobby from "./Lobby/Lobby";
import InGame from "./InGame/InGame";
import {Spinner} from "react-bootstrap";
import EndGameLobby from "./EndGameLobby/EndGameLobby";
import {useLocation, useNavigate} from "react-router-dom";

function useQuery() {
    const {search} = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function ChosePlayerIdForm() {
    const query = useQuery()
    const gameId = query.get("gameId")
    const [playerName, setPlayerName] = useState("")
    const navigate = useNavigate()
    const handleJoinGameSubmit = async () => {
        const playerId = await axios.post('http://localhost:8080/game/' + gameId + '/join', {},
            {
                params: {playerName: playerName}
            }
        );
        navigate("/game?playerId=" + playerId.data + "&gameId=" + gameId)
    }

    function handleSubmitThroughEnter(event) {
        handleJoinGameSubmit()
        event.preventDefault();
    }

    return <form className="new-game-form" onSubmit={(event) => {
        handleSubmitThroughEnter(event)
    }}>
        <label className="option-label">Player Name</label>
        <div><input type="text" className="new-game-txt-input" placeholder={"Player123"} value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}/></div>
        <div className="game-selection-button" onClick={() => handleJoinGameSubmit()}>Join Game</div>
    </form>
}

function Game() {
    const query = useQuery();
    const playerId = query.get("playerId")
    const gameId = query.get("gameId")

    const [state, setState] = useState({
        files: [],
        questions: [],
        answers: []
    });

    const [gameData, setGameData] = useState(null)

    const removeImage = (i) => {
        const files = [...state.files];
        const questions = [...state.questions]
        const answers = [...state.answers]
        files.splice(i, 1);
        questions.splice(i, 1);
        answers.splice(i, 1);
        setState({
            files: files,
            questions: questions,
            answers: answers
        })
    }

    function handleQuestionChange(i, value) {
        const questions = [...state.questions]
        questions[i] = value;
        setState({
            files: state.files,
            questions: questions,
            answers: state.answers
        })
    }

    function handleAnswerChange(i, value) {
        const answers = [...state.answers]
        answers[i] = value
        setState({
            files: state.files,
            questions: state.questions,
            answers: answers
        })

    }

    const handleNewFiles = (newFiles) => {
        if (state.files.length + newFiles.length > 5) {
            alert("You must only add 5 files.")
            return
        }
        const newFilesArray = [...state.files, ...newFiles];
        const newQuestions = [...state.questions]
        const newAnswers = [...state.answers]

        newFiles.forEach(() => {
            newQuestions.push('');
            newAnswers.push('')
        })

        setState({
            files: newFilesArray,
            questions: newQuestions,
            answers: newAnswers
        })
    }


    useEffect(() => {
        const timeout = setTimeout(fetchGameData, 1000);
        return () => clearTimeout(timeout);
    })

    const fetchGameData = () => {
        if(playerId == null){
            axios.get('http://localhost:8080/game/' + gameId).then(data => setGameData(data.data))
        }else{
            axios.get('http://localhost:8080/game/' + gameId+"?playerId=" + playerId).then(data => setGameData(data.data))
        }
    }

    const handleStartGame = async () => {
        await axios.get('http://localhost:8080/game/' + gameId + '/start').catch(p => p);
        const data = await axios.get('http://localhost:8080/game/' + gameId);
        setGameData(data.data)
    }

    const handleAcceptedAnswers = async (playerIds) => {
        let fd = new FormData();
        fd.append('playerIds', playerIds)
        await axios.post('http://localhost:8080/game/' + gameId + '/acceptAnswers', fd
        );
    }

    const handleAnswer = async (answer) => {
        await axios.post('http://localhost:8080/game/' + gameId + '/answer', {},
            {
                params: {playerId: playerId, answer: answer}
            }
        );
    }

    const renderGame = () => {
        if (gameData != null) {
            if (gameData.gameState === "LOBBY") {
                if (playerId != null) {
                    return <Lobby gameState={gameData} playerId={playerId}
                                  handleOnClick={handleStartGame}
                                  handleQuestionChange={handleQuestionChange}
                                  handleAnswerChange={handleAnswerChange}
                                  handleNewfiles={handleNewFiles}
                                  removeImage={removeImage}
                                  files={state.files}
                                  answers={state.answers}
                                  questions={state.questions}/>
                } else {
                    return <ChosePlayerIdForm/>
                }
            } else if (gameData.gameState === "ENDED") {
                return <EndGameLobby gameState={gameData} playerId={playerId}></EndGameLobby>
            }
            return <InGame playerId={playerId} state={gameData}
                           handleAnswer={handleAnswer}
                           handleAcceptedAnswers={handleAcceptedAnswers}/>
        } else {
            return <div className="spinner-wrp"><Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner></div>
        }
    }

    return (renderGame()
    )

}

export default Game;