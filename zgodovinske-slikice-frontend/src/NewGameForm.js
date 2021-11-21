import React from "react";

class NewGameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {playerName: ''};
    }

    handleNameChange(event) {
        this.setState({playerName: event.target.value});
    }

    handleSubmit() {
        this.props.handleSubmit(this.state.playerName);
    }

    handleSubmitThroughEnter(event) {
        this.props.handleSubmit(this.state.playerName);
        event.preventDefault();
    }

    render() {
        return (
            <form className="new-game-form" onSubmit={(event) => {
                this.handleSubmitThroughEnter(event)
            }}>
                <label>Player Name</label>
                <div><input className="new-game-txt-input" type="text" placeholder={"Player123"} value={this.state.playerName}
                            onChange={(e) => this.handleNameChange(e)}/></div>
                <div className="game-selection-button" onClick={()=>this.handleSubmit()}>Create Game</div>
            </form>
        );
    }

}

export default NewGameForm