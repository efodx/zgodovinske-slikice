import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function JoinExistingGameForm(props) {
    const [playerName, setPlayerName] = useState("")
    const [gameId, setGameId] = useState("")
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


    return (
        <form className="new-game-form" onSubmit={(event) => {
            handleSubmitThroughEnter(event)
        }}>
            <label className="option-label">Player Name</label>
            <div><input type="text" className="new-game-txt-input" placeholder={"Player123"} value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}/></div>
            <label className="option-label">Game Id</label>
            <div><input type="text" className="new-game-txt-input" placeholder={"uYifXYRTZL"} value={gameId}
                        onChange={(e) => setGameId(e.target.value)}/></div>
            <div className="game-selection-button" onClick={() => handleJoinGameSubmit()}>Join Game</div>
        </form>
    );
}

export default JoinExistingGameForm