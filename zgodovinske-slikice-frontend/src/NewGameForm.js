import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function NewGameForm(props) {
    const [playerName, setPlayerName] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const gameId = await axios.get('http://localhost:8080/game/create');
        const playerId = await axios.post('http://localhost:8080/game/' + gameId.data + '/join', {},
            {
                params: {playerName: playerName}
            }
        );
        navigate("/game?playerId=" + playerId.data + "&gameId=" + gameId.data)
    }

    function handleSubmitThroughEnter(event) {
        handleSubmit();
        event.preventDefault();
    }


    return (
        <form className="new-game-form" onSubmit={(event) => {
            handleSubmitThroughEnter(event)
        }}>
            <label className="option-label">Player Name</label>
            <div><input className="new-game-txt-input" type="text" placeholder={"Player123"}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}/></div>
            <div className="game-selection-button" onClick={() => handleSubmit()}>Create Game</div>
        </form>
    );

}

export default NewGameForm