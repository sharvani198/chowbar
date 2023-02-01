import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Game from './Game';
import {storeState, getState, StateSlice} from './utils.js'
var numOfPlayers = 0; // Should this be dynamic input?


function PlayerCount(props) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if(count) {
      window.location.search = "";
      storeState("numOfPlayers",Number(count));      
    }
  });
  return (
    <div>
      <form action="#">
        <span>How many players? </span>
        <label><input type="radio" value="2" name="c" onChange={()=>{setCount(2)}}/>2</label>
        <label><input type="radio" value="4" name="c" onChange={()=>{setCount(4)}}/>4</label>
        <input type="submit" value="Set"/>
      </form>
     </div>
    );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameSetup: {
        numOfPlayers: getState("numOfPlayers") || numOfPlayers,
        playing: getState("playing") || Array(getState("numOfPlayers")).fill(false)
      },
      currentPlayer:null
    }
    this.state.currentPlayer = new URLSearchParams(window.location.search).get("player") || sessionStorage.getItem("currentPlayer");
  }
  choosePlayer(i){
    let gameSetup = this.state.gameSetup;
    gameSetup.playing[i] = true;
    this.setState({gameSetup: gameSetup});
    storeState("playing", this.state.gameSetup.playing);
    this.state.currentPlayer = i;
    sessionStorage.setItem("currentPlayer", this.state.currentPlayer);
  }
  render() {
    let playerChoices = [];
    this.state.gameSetup.playing.forEach((p,i) => {
      playerChoices.push(<button key={i} disabled={p} onClick={()=>this.choosePlayer(i)}>{`Player${i+1}`}</button>);
    });
    return (
      <div className="App">
        <h1> Chowka Bara </h1>
        <hr/>
         
        {this.state.gameSetup.numOfPlayers==0 ? <PlayerCount/> : 
          this.state.currentPlayer==null 
            ?
              <div className="setup">    
                <p> This is a game with {this.state.gameSetup.numOfPlayers} players. Choose which player you are: {playerChoices} </p>
              </div> 
            :
              <div className="game">
                <StateSlice currentPlayer={this.state.currentPlayer} playing={this.state.gameSetup.playing}/>
                <Game playing={this.state.gameSetup.playing} currentPlayerIndex={this.state.currentPlayer}/>
              </div>
         }      
      </div>
      );
  }
}

export default App;
