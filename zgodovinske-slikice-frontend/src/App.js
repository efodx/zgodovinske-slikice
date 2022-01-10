import logo from './logo.svg';
import './App.css';
import './Lobby/Lobby.css';
import Main from "./Main";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Router} from "react-router-dom";

function App() {
    return (
<BrowserRouter>
        <Main/></BrowserRouter>
    );
}

export default App;
