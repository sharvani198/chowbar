import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './Board'
import {Player} from './Player'
import {randomiseInitialTurn, randomDiceValue, storeState, useDiceDispatch, useDiceValue} from './utils'
import "./game.css"

const HOME_SQUARES = ["square02", "square42", "square20", "square24"];

const WIN_SQUARE = "square22";

function RollDice(props) {
	const [diceValue, setDiceValue] = React.useState("X");
	React.useEffect(() => {
		storeState('prevDiceValue', diceValue);
	});
	useDiceDispatch(Number(diceValue));
	return (<div className="playTurn">
				<button onClick={()=> {setDiceValue(randomDiceValue())}}>Roll Dice -> </button>
				<div className="diceValue" >
					<div>{diceValue}</div>
				</div>
			</div>);
}

function PlayTurn() {
	const diceValue = useDiceValue();
	return (<div>You rolled {diceValue}. Please play your turn by click on the desired pawn and moving it {diceValue} places.</div>);
}
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			players: [],
			currentPlayer: null
		}
		let players = [];
		//const randomHomeInd = Math.floor(Math.random()*HOME_SQUARES.length); probably not needed to randomeise home
		props.playing.forEach((p,i) => {
			if (p==true){
				players[i] = {
					name: `Player${i+1}`,
					pid: i,
					home: HOME_SQUARES[i],
					pawnLocs: Array(4).fill(HOME_SQUARES[i]) //initial pawn location is home square
				}
			}
		});
		this.state.players = players;
		this.state.currentPlayer = this.state.players[props.currentPlayerIndex];
		this.state.turnPid = randomiseInitialTurn(props.playing.length);
	}
	
	render() {
		let playerList = [];
		let allPawnLocs = {};
		this.state.players.forEach((p,i)=>{
			p.pawnLocs.forEach((l,i) => {
				allPawnLocs[`${p.pid}-${i}`] = l;
			});
	        playerList.push()
	    });
     	const currentTurn = this.state.players[this.state.turnPid];
	    
		return (
			<React.Fragment>
			<div className="gameBox">
				{!this.state.currentPlayer && <div> What?!!! Can't play</div>} 

				<div className="currentPlayer">
					<div className="playerInfo">{this.state.currentPlayer.name}<div>/o\</div></div> 
					<Player active={false} diceValue={0} name={this.state.currentPlayer.name} 
							key={this.state.currentPlayer.pid+1} 
							pid={this.state.currentPlayer.pid} 
							turnPid={this.state.turnPid} 
							home={this.state.currentPlayer.home} 
							pawnLocs={this.state.currentPlayer.pawnLocs}/>
				</div>
				<div className="playingBox"> 
					<span> Current Turn: {currentTurn.name} </span>
					{currentTurn.pid==this.state.currentPlayer.pid 
						? <div className="currentTurn"> <RollDice/><PlayTurn/></div>
						: <div className="waitTurn"> Other players turn. Wait.</div>
					}
				</div>
			</div>
			{}
			<Board allPawnLocs={allPawnLocs} />
			</React.Fragment>
		);

	}
}

export default Game