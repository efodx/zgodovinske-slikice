import {useEffect, useState} from "react";
import axios from 'axios'
import Game from "./Game";
import JoinExistingGameForm from "./JoinExistingGameForm";
import NewGameForm from "./NewGameForm";
import {Navigate, Route, Router, Routes, useNavigate} from "react-router-dom";


function GameSelector(props) {
    const navigate = useNavigate()
    return (<div className="game-selection">
        <div className="game-selection-button top-button" onClick={() => navigate("/new")}>New Game</div>
        <div className="game-selection-button bot-button" onClick={() => navigate("/existing")}>Existing Game</div>
    </div>)
}


function Main() {
    return (
            <div className="main-page">
                <Routes>
                <Route path="/" element={<Navigate to="gameSelect"/>}/><Route path="/" element={<Navigate to="gameSelect"></Navigate>}/>
                    <Route path="/gameSelect" element={<GameSelector/>}/>
                    <Route path="/new" element={<NewGameForm/>}/>
                    <Route path="/existing" element={<JoinExistingGameForm />}/>
                    <Route path="/game" element={<Game/>}/>
                </Routes>
            </div>
    )

}

export default Main;