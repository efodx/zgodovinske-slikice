import {useDropzone} from 'react-dropzone'
import {useCallback, useEffect, useState} from 'react'
import axios from 'axios'
import {Badge} from "react-bootstrap";
import SelectedCard from "../SelectedCard/SelectedCard";
import "./EndGameLobby.css"

function Player(props) {
    const player = props.player
    return <li>
        <div className="player-name"> {player.playerName}{" "}{player.cards.length == 5 &&
        <div className={"badge-wrapper"}><Badge pill bg="success">
            Ready
        </Badge></div>}</div>
    </li>
}
function getPlayerName(players, playerId){
    return players.filter(p=> p.id == playerId).map(p => p.playerName)[0]
}


function TurnInformation(props){
    const playerAsking = props.turnInfo.playerAsking
    const answers = props.turnInfo.answers
    const cardPlayed = props.turnInfo.cardPlayed;
    const players = props.players;


    return <div className="turn-information">
        <div className="played-by">Played by: {getPlayerName(players,playerAsking)}</div>
        <div className="correct-answer">Correct Answer</div>
        <div className="answer">{cardPlayed.answer}s</div>
        <div className="given-answers">Given Answers</div>
        {Object.entries(answers).map(entry => <div className="given-answer"><b>{getPlayerName(players, entry[0])}</b>:{entry[1]}</div>)}
    </div>
}

function EndGameLobby(props) {
    const [history, setHistory] = useState(null)
    const [page, setPage] = useState(0);

    const fetchHistoryData = () => {
        if(history === null){
        axios.get('http://localhost:8080/game/' + props.gameState.gameId+'/history').then(data => setHistory(data.data))}
    }

    useEffect(()=>fetchHistoryData());

    props.gameState.players.sort((p1,p2)=> p1.points - p2.points);


    const renderLobby = () => {
        return <div className="lobby-wrapper">
            <div className="lobby-center-wrapper">
                <div className="game-info-wrapper">
                    <div key={'game-id'} className="game-id">
                        <h2>ID: {props.gameState.gameId}</h2>
                    </div>
                    <div key={'players-info-wrapper'} className="players-info-wrapper">
                        <div key={"players-info-header"} className="players-info-header">
                            <div className="players-info-header-header">Rankings</div>
                        </div>
                        <ol key={'ol'}> {props.gameState.players.map((player) => <Player key={player.playerId}
                                                                                         player={player}/>)}</ol>
                    </div>

                </div>

                <div className="history-wrapper">
                    <div className="history-info-wrapper">
                        <div className="card-wrapper">
                            {history && <SelectedCard card={history[page].cardPlayed}></SelectedCard>}
                        </div>
                        <div className="history-info-info-wrapper">
                            {history && <TurnInformation players={props.gameState.players} turnInfo={history[page]}></TurnInformation>}
                        </div>
                    </div>
                    <div className="history-buttons-wrapper">
                        {history && (history.length > page+1) && <div className="previous-button"  onClick={e => setPage(page+1)}>Prev</div>}
                        {history && (0 < page) && <div className="next-button" onClick={e => setPage(page-1)}>Next</div>}
                    </div>
                </div>
            </div>
        </div>
    }


    return (renderLobby())

}

export default EndGameLobby;