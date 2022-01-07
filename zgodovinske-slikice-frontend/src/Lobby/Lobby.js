import {useDropzone} from 'react-dropzone'
import {useCallback, useEffect, useState} from 'react'
import axios from 'axios'
import {Badge} from "react-bootstrap";
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'


function Player(props) {
    const player = props.player
    return <li>
        <div className="player-name"> {player.playerName}{" "}{player.cards.length == 5 &&
        <div className={"badge-wrapper"}><Badge pill bg="success">
            Ready
        </Badge></div>}</div>
    </li>
}

function DropZone(props) {
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: acceptedFiles => {
            props.onFileDrop(acceptedFiles)
        }
    })

    return (
        <div className="drop-zone" {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some images here, or click to select images</p>
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
    const [picker, setPicker] = useState(1);
    const [imageList, setImageList] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/images").then(async response => {
            setImageList(response.data.map(imageName => "http://localhost:8080/images/" + imageName))
        })
    }, [])

    const renderHandledFiles = () => {
        return props.files.map((file, i) => <CardPreview id={i} handleImageClick={() => removeImage(i)}
                                                         file={file} question={props.questions[i]}
                                                         answer={props.answers[i]}
                                                         handleQuestionChange={(value) => handleQuestionChange(i, value)}
                                                         handleAnswerChange={(value) => handleAnswerChange(i, value)}
        />)
    }

    const handleAddCards = async () => {
        if (props.questions.length != 5) {
            alert("You must add 5 cards.")
            return
        }
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

    const onPick = (images) => {
        setSelectedImages(images)
    }

    async function selectImages() {
        let urls = selectedImages.map(im => im.src)
        const axiosCalls = []
        for (let i = 0; i < urls.length; i++) {
            axiosCalls.push(axios.get(urls[i],{ responseType: 'blob' }))
        }
        const imageFiles = []
        for (let i = 0; i < urls.length; i++) {
            const response = await axiosCalls[i]
            imageFiles.push(response.data)
        }
        handleNewFiles(imageFiles)
        setPicker(1)
    }

    const renderLobby = () => {
        return <div className="lobby-wrapper">
            <div className="lobby-center-wrapper">
                <div className="game-info-wrapper">
                    <div key={'game-id'} className="game-id">
                        <h2>ID: {props.gameState.gameId}</h2>
                    </div>
                    <div key={'players-info-wrapper'} className="players-info-wrapper">
                        <div key={"players-info-header"} className="players-info-header">
                            <div className="players-info-header-header">Players</div>
                        </div>
                        <ol key={'ol'}> {props.gameState.players.map((player) => <Player key={player.playerId}
                                                                                         player={player}/>)}</ol>
                    </div>

                    <div className="start-container">
                        {(props.playerId === props.gameState.ownerId) &&
                        <div
                            className={`start-button ${props.gameState.players.some((player) => player.cards.length != 5) ? 'disabled' : 'enabled'}`}
                            onClick={() => props.handleOnClick()}>START GAME</div>}
                    </div>
                </div>

                <div className="card-adder-wrp">
                    <div className="file-handling-wrp">
                        <div className="inner-file-handling-wrp">
                            <div className="pick-selector">
                                <div className={`${picker == 1 ? 'selected' : ''}`} onClick={() => setPicker(1)}>Cards</div>
                                <div className={`${picker == 2 ? 'selected' : ''}`} onClick={() => setPicker(2)}>Upload Own</div>
                                <div className={`${picker == 3 ? 'selected' : ''}`} onClick={() => setPicker(3)}>Pick From Gallery</div>
                            </div>
                            {picker == 1 ? <div className="handled-files-wrp">
                                {renderHandledFiles()}
                            </div> : (picker == 2 ? <DropZone gameId={props.gameState.gameId} playerId={props.playerId}
                                                              onFileDrop={(files) => {handleNewFiles(files)
                                                                  setPicker(1)}}/> :
                                <div className="handled-files-wrp"><ImagePicker multiple={true}
                                                                                images={imageList.map((image, i) => ({
                                                                                    src: image,
                                                                                    value: i
                                                                                }))}
                                                                                onPick={(image) => onPick(image)}/>
                                </div>)}
                            {picker == 1? <div className={`add-cards-btn ${props.files.length == 5 ? 'enabled' : 'disabled'}`}
                                 onClick={() => handleAddCards()}>CONFIRM CARDS
                            </div>: (picker==2? <div></div>: <div onClick={()=>selectImages()} className={`add-cards-btn ${selectedImages.length + props.files.length == 5 ? 'enabled' : 'disabled'}`} >SELECT IMAGES</div>)}

                        </div></div>
                </div>
            </div>
        </div>
    }


    return (renderLobby())

}

export default Lobby;