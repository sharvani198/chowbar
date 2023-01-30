import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Game from './Game';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1> Chowka Bara </h1>
        <hr/>
        <div className="Game">
        <Game numOfPlayers="2"/>
        </div>
      </div>
      );
  }
}

export default App;
