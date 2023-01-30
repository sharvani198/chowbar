import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './Board'
import {Player} from './Player'
import "./game.css"

const HOME_SQUARES = ["square02", "square42", "square20", "square24"];

const WIN_SQUARE = "square22";

function randomiseInitialTurn(numOfPlayers) {
	return Math.floor(Math.random()*numOfPlayers);
}
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			players: []
		}
		let players = [];
		//const randomHomeInd = Math.floor(Math.random()*HOME_SQUARES.length); probably not needed to randomeise home
		for(let i=0; i<Number(props.numOfPlayers);i++) {
			players[i] = {
				pid: i,
				home: HOME_SQUARES[i],
				pawnLocs: Array(4).fill(HOME_SQUARES[i]) //initial pawn location is home square
			}
		}
		this.state.players = players;
		this.state.turnPid = randomiseInitialTurn(props.numOfPlayers);
	}
	render() {
		let playerList = [];
		let allPawnLocs = {};
		this.state.players.forEach((p,i)=>{
			p.pawnLocs.forEach((l,i) => {
				allPawnLocs[`${p.pid}-${i}`] = l;
			});
	        playerList.push(<Player key={i+1} pid={p.pid} turnPid={this.state.turnPid} home={p.home} pawnLocs={p.pawnLocs}/>)
	    });
     
		return (
			<div className="game">
				{playerList}
				<Board allPawnLocs={allPawnLocs}>
				</Board>
			</div>
		);

	}
}

export default Game