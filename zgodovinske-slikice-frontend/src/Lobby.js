function Player(props) {
    const player = props.player
    return <li>
        <div className="player-name"> {player.playerName}</div>
        <div>{player.cards.length}</div>
    </li>
}

function Card(props) {
    const card = props.card;
    return <div>
        {card.question}?
        {card.answer}

    </div>
}

function Lobby(props) {


    const renderLobby = () => {
        return <div className="lobby-wrapper">
            <div className="lobby-header"><h1>Lobby</h1></div>

            <div className="lobby-center-wrapper">
                <div className="game-info-wrapper">
                    <div className="game-id">
                        <h2>ID: {props.gameState.gameId}</h2>
                    </div>
                    <div className="players-info-wrapper">
                        <div className="players-info-header"><h3>Players</h3></div>

                        <ol>{props.gameState.players.map((player) => <Player player={player}/>)}</ol>
                    </div>
                </div>

                <div className="card-adder-wrp">
                    <button onClick={() => props.handleAddCard()}>ADD CARD</button>
                </div>
            </div>
            <div className="start-container">

                {(props.playerId === props.gameState.ownerId) &&
                <div className="start-button" onClick={() => props.handleOnClick()}><h1>START</h1></div>}
            </div>
        </div>
    }


    return (renderLobby())

}

export default Lobby;