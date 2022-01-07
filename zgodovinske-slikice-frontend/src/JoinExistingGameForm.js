import React from "react";

class JoinExistingGameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {playerName: '', gameId:''};
    }

    handleNameChange(event) {
        this.setState({playerName: event.target.value});
    }

    handleIdChange(event) {
        this.setState({gameId: event.target.value});
    }

    handleSubmitThroughEnter(event) {
        this.props.handleSubmit(this.state.playerName, this.state.gameId);
        event.preventDefault();
    }

    handleSubmit(){
        this.props.handleSubmit(this.state.playerName, this.state.gameId);
    }

    render() {
        return (
            <form className="new-game-form" onSubmit={(event)=>{this.handleSubmitThroughEnter(event)}}>
                <label className="option-label">Player Name</label>
                <div><input type="text" className="new-game-txt-input" placeholder={"Player123"} value={this.state.playerName} onChange={(e)=>this.handleNameChange(e)}/></div>
                <label className="option-label">Game Id</label>
                <div><input type="text" className="new-game-txt-input" placeholder={"uYifXYRTZL"} value={this.state.gameId} onChange={(e)=>this.handleIdChange(e)}/></div>
                <div className="game-selection-button" onClick={()=>this.handleSubmit()}>Join Game</div>
            </form>
        );
    }
}

export default JoinExistingGameForm