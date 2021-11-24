import {useEffect, useState} from "react";
import axios from 'axios'
import Lobby from "./Lobby/Lobby";
import InGame from "./InGame/InGame";
import {Spinner} from "react-bootstrap";


function Game(props) {
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
        const newFilesArray = [...state.files, ...newFiles];
        const newQuestions = [...state.questions]
        const newAnswers = [...state.answers]

        newFiles.forEach(() => {
            newQuestions.push('');
            newAnswers.push('')
        })

        console.log('old files len:' + state.files.length)
        console.log('new files len:' + newFiles.length)
        console.log('new files arr len:' + newFilesArray.length)
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
        axios.get('http://localhost:8080/game/' + props.gameId).then(data => setGameData(data.data))
    }

    const handleStartGame = async () => {
        await axios.get('http://localhost:8080/game/' + props.gameId + '/start').catch(p => p);
        const data = await axios.get('http://localhost:8080/game/' + props.gameId);
        setGameData(data.data)
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
        if (gameData != null) {
            if (gameData.gameState === "LOBBY") {
                return <Lobby gameState={gameData} playerId={props.playerId} handleAddCard={handleAddCard}
                              handleOnClick={handleStartGame}
                              handleQuestionChange={handleQuestionChange}
                              handleAnswerChange={handleAnswerChange}
                              handleNewfiles={handleNewFiles}
                              removeImage={removeImage}
                              files={state.files}
                              answers={state.answers}
                              questions={state.questions}/>
            }
            return <InGame playerId={props.playerId} state={gameData} handleAnswer={handleAnswer}/>
        } else {
            return <div className="spinner-wrp"><Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner></div>
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