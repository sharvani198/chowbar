import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './Board'
import {Player} from './Player'
import {randomiseInitialTurn, randomDiceValue, 
storeState, getState, useValueSetter, useValueGetter, 
getSessionState, setSessionState, 
setDiceValue, setActivePlayer} from './utils'
import "./game.css"

const HOME_SQUARES = ["square02", "square42", "square20", "square24"];
const PLAYER_ATTIBUTES = [
	{	home:"square02",
		colours:'green',
		path:["02","01","00","10","20","30","40","41","42","43","44","34","24","14","04","03", "13","23","33","32","31","21","11","12","22"]
	},
  	{	home:"square42",
  		colours:'maroon',
  		path:["42","43","44","34","24","14","04","03", "02","01","00","10","20","30","40","41","31","21","11","12","13","23","33","32","22"]
  	},
  	{	home:"square20",
  		colours:'indigo',
  		path:["20","30","40","41","42","43","44","34","24","14","04","03", "02","01","00","10","11","12","13","23","33","32","31","21","22"]
  	},
  	{	home:"square24",
  		colours:'purple',
  		path:["24","14","04","03", "02","01","00","10","20","30","40","41","42","43","44","34","33","32","31","21","11","12","13","23","22"]
  	}
]

const WIN_SQUARE = "square22";

const TURN_STATES = {yetToRoll:'yetToRoll',rolledButNotPlayed:'rolledButNotPlayed', pawnMoved:'pawnMoved', turnPlayed:'turnPlayed'};

function RollDice(props) {
	//const [diceValue, setDice] = React.useState("X");
	// React.useEffect(() => {

	// })
	// useValueSetter(setDiceValue, Number(diceValue));
	//useValueSetter(setActivePlayer, props.activePlayer);
	// storeState('diceValue', diceValue);
	if (props.currentTurnState==TURN_STATES.rolledButNotPlayed) {
		return ;
	}
	return (<React.Fragment>
				<div className="playTurn">
					<button className="turnButtons" disabled={props.dice!=null} onClick={() => {
						let dice = randomDiceValue(); 
						props.onRoll(dice);
					}}>Roll Dice</button>
				</div>
				<div className="diceValue" >
					<div>{props.diceValue}</div>
				</div>
			</React.Fragment>
			);
}

function PlayTurn(props) {
	const disabled = props.currentTurnState != TURN_STATES.pawnMoved ;
	return (
		<button className="turnButton" disabled={disabled} onClick={() => props.updateTurn()}>Done</button>
	)
}
function DisplayMessage(props) {
	return (<React.Fragment>{props.msg && <div className='playerMessage'>{props.msg}</div>}</React.Fragment>)
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
				players[i] = {
					name: `Player${i+1}`,
					pid: i,
					home: PLAYER_ATTIBUTES[i].home,
					pawnLocs: Array(4).fill(PLAYER_ATTIBUTES[i].home) //initial pawn location is home square
				}
		});
		this.state.playerMessage = null;
		this.state.players = players;
		this.state.currentPlayer = this.state.players[props.currentPlayerIndex];
		this.state.turnPid = randomiseInitialTurn(props.playing.length);
		this.state.diceValue = getState("diceValue") || null;
		this.state.activePlayer =  null;
	}
	rollHandler(dice) {
		this.state.diceValue=dice;
		let prevState = this.state;
		prevState.diceValue = dice;
		prevState.playerMessage = `You rolled ${dice}. Please play your turn then click Done below.`;
		prevState.activePlayer = prevState.currentPlayer;
		prevState.currentTurnState = TURN_STATES.rolledButNotPlayed;
		this.setState(prevState);
	}

	turnHandler() {

	}

	updateTurn(turnState) {
		let prevState =this.state;
		prevState.currentTurnState = turnState;
		prevState.activePlayer =  null;
		this.setState(prevState);		
	}
	messageSetter(msg) {
		let prevState =this.state;
		prevState.playerMessage = msg;
		this.setState(prevState);
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
	    const yourTurn = this.state.turnPid==this.state.currentPlayer.pid;
		return (
			<React.Fragment>
			<div className="gameBox">
				{!this.state.currentPlayer && <div> What?!!! Can't play</div>} 

				<div className="currentPlayer">
					<div className="playerInfo" >
						<span>{this.state.currentPlayer.name}</span>
						<div className="playerAvatar" 
							title={`You are player ${this.state.currentPlayer.name}. 
									Your pawns have a ${PLAYER_ATTIBUTES[this.state.currentPlayer.pid].colours} border. 
									Your home square is ${PLAYER_ATTIBUTES[this.state.currentPlayer.pid].home} `} 
							style={{borderColor:PLAYER_ATTIBUTES[this.state.currentPlayer.pid].colours}}>/o\</div>
					</div> 
					<Player active={false} diceValue={0} name={this.state.currentPlayer.name} 
							key={this.state.currentPlayer.pid+1} 
							pid={this.state.currentPlayer.pid} 
							turnPid={this.state.turnPid} 
							home={this.state.currentPlayer.home} 
							pawnLocs={this.state.currentPlayer.pawnLocs}/>
				</div>
				{yourTurn ? 
					<div className="playingBox"> 
						<span> Current Turn:  Yours </span>
						<div className="currentTurn"> 
							<RollDice
								activePlayer={this.state.activePlayer}
							 	currentTurnState={this.state.currentTurnState} 
							 	diceValue={this.state.diceValue} 
								onRoll={(d) => this.rollHandler(d)}/>
						</div>
					</div>
					: <div className="waitTurn"> Other players turn. Wait.</div>
				}
			</div>
			<DisplayMessage msg={this.state.playerMessage}/>
			<Board allPawnLocs={allPawnLocs} activePlayer={this.state.activePlayer} updateTurn={() => this.updateTurn(TURN_STATES.pawnMoved)}  path={PLAYER_ATTIBUTES[this.state.currentPlayer.pid].path} diceValue={this.state.diceValue} />
			{yourTurn && <PlayTurn 	currentTurnState={this.state.currentTurnState} updateTurn={() => this.updateTurn(TURN_STATES.turnPlayed)} />}
			</React.Fragment>
		);

	}

}

export default Game