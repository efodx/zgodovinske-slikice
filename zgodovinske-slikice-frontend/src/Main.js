import {useEffect, useState} from "react";
import axios from 'axios'
import Game from "./Game";
import JoinExistingGameForm from "./JoinExistingGameForm";
import NewGameForm from "./NewGameForm";


function GameSelector(props){
    return (<div className="game-selection">
        <div className="game-selection-button top-button" onClick={() => props.setGameSelection(1)}>
            Create New Game
        </div>
        <div className="game-selection-button bot-button" onClick={() => props.setGameSelection(2)}>
            Join Existing Game
        </div>
    </div>)
}


function Main() {
    const [gameSelection, setGameSelection] = useState(null);
    const [state, setState] = useState({inGame: false});

    const handleNewGameSubmit = async (playerName) => {
        const gameId = await axios.get('http://localhost:8080/game/create');
        const playerId = await axios.post('http://localhost:8080/game/' + gameId.data + '/join', {},
            {
                params: {playerName: playerName}
            }
        );
        setState({inGame: true, id: gameId.data, playerId: playerId.data});
    }

    const handleJoinGameSubmit = async (playerName, gameId) => {
        const playerId = await axios.post('http://localhost:8080/game/' + gameId + '/join', {},
            {
                params: {playerName: playerName}
            }
        );
        setState({inGame: true, id: gameId, playerId: playerId.data});
    }

    const renderGame = () => {
        {
            if (state.inGame) {
                console.log('we went in')
                return <Game gameId={state.id} playerId={state.playerId}/>
            }
            if (gameSelection == null) {
                return <GameSelector setGameSelection={setGameSelection}/>
            }
            if (gameSelection === 1) {
                return <NewGameForm handleSubmit={handleNewGameSubmit}/>
            }
            if (gameSelection === 2) {
                return <JoinExistingGameForm handleSubmit={handleJoinGameSubmit}/>
            }
        }
    }

    return (
        <div className="main-page">
            {renderGame()}
        </div>
    )

}

export default Main;