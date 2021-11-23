import {useDropzone} from 'react-dropzone'
import {useCallback, useState} from 'react'
import axios from 'axios'

function Player(props) {
    const player = props.player
    return <li>
        <div className="player-name"> {player.playerName}</div>
        <div>{player.cards.length}</div>
    </li>
}

function DropZone(props) {
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop:acceptedFiles => {
            props.onFileDrop(acceptedFiles)
        }})

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


function CardPreview(props) {
    const [imageSrc, setImageSrc] = useState('');

    const reader = new FileReader();
    reader.readAsDataURL(props.file);

    reader.onloadend = (e) => setImageSrc(reader.result);

    return <div className='card-preview-container'>
        <div className="question-answer-input">
            <input id={"question" + props.id} placeholder={"Question"} type={'text'} value={props.question}
                   onChange={(e) => props.handleQuestionChange(e.target.value)}/>
            <input id={"answer" + props.id} placeholder={"Answer"} type={'text'} value={props.answer}
                   onChange={(e) => props.handleAnswerChange(e.target.value)}/>
        </div>
        <img onClick={() => props.handleImageClick()} className="image-preview" src={imageSrc}/>
    </div>
}

function Lobby(props) {
    const removeImage = props.removeImage
    const handleQuestionChange = props.handleQuestionChange
    const handleAnswerChange = props.handleAnswerChange
    const handleNewFiles = props.handleNewfiles
    const renderHandledFiles = () => {
        return props.files.map((file, i) => <CardPreview id={i} handleImageClick={() => removeImage(i)}
                                                         file={file} question={props.questions[i]}
                                                         answer={props.answers[i]}
                                                         handleQuestionChange={(value) => handleQuestionChange(i, value)}
                                                         handleAnswerChange={(value) => handleAnswerChange(i, value)}
        />)
    }

    const handleAddCards = async () => {
        let fd = new FormData();
        fd.append('questions', props.questions)
        fd.append('answers', props.answers)
        props.files.forEach(file => fd.append('files', file))
        await axios.post('http://localhost:8080/game/' + props.gameState.gameId + '/addCards', fd,
            {
                params: {playerId: props.playerId},
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
                    <div key={'game-id'} className="game-id">
                        <h2>ID: {props.gameState.gameId}</h2>
                    </div>
                    <div key={'players-info-wrapper'} className="players-info-wrapper">
                        <div key={"players-info-header"} className="players-info-header"><h3>Players</h3></div>
                        <ol key={'ol'}> {props.gameState.players.map((player) => <Player key={player.playerId}
                                                                                         player={player}/>)}</ol>
                    </div>
                </div>

                <div className="card-adder-wrp">
                    <div className="file-handling-wrp">
                        <div className="handled-files-wrp">{renderHandledFiles()}</div>
                        <DropZone gameId={props.gameState.gameId} playerId={props.playerId}
                                  onFileDrop={(files) => handleNewFiles(files)}/></div>
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