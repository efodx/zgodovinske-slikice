import {useDropzone} from 'react-dropzone'
import {useCallback,useState} from 'react'
import axios from 'axios'

function Player(props) {
    const player = props.player
    return <li>
        <div className="player-name"> {player.playerName}</div>
        <div>{player.cards.length}</div>
    </li>
}

function DropZone(props) {

  const onDrop = useCallback(acceptedFiles => {
    props.onFileDrop(acceptedFiles[0])
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="drop-zone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

function Card(props) {
    const card = props.card;
    return <div>
        {card.question}?
        {card.answer}

    </div>
}

function Lobby(props) {
    const [files, setFiles] = useState([]);

    const renderHandledFiles = () => {
        return files.map(file=> file.name)
    }

    const handleNewfile = (file) => {
    console.log('hanlding file' + file.name)
        setFiles([...files, file]);
    }

    const handleAddCards = () =>{
       files.forEach(file=> handleAddCard(file))
    }

        const handleAddCard = async (file) => {
            let fd = new FormData();
            fd.append('image',file)
            await axios.post('http://localhost:8080/game/' + props.gameState.gameId + '/addCard', fd,
                {
                    params: {playerId: props.playerId, answer: "SOME ANSWER BOY"},
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                },
            );
        }


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
                    <div className="file-handling-wrp">
                    <div className="handled-files-wrp">{renderHandledFiles()}</div>
                    <DropZone gameId={props.gameState.gameId} playerId={props.playerId} onFileDrop={(file) => handleNewfile(file)}></DropZone></div>
                    <button className="add-cards-btn" onClick={() => handleAddCards()}>ADD CARDS</button>
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