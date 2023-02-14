import React from 'react';
import ReactDOM from 'react-dom/client';
import Board from './Board'
import {Player} from './Player'
import {randomiseInitialTurn, randomDiceValue, 
storeState, getState, useValueSetter, useValueGetter, 
getSessionState, setSessionState, 
setDiceValue, setActivePlayer, setAllPawnLocs} from './utils'
import "./game.css"

let prevState;


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

const TURN_STATES = {yetToRoll:'yetToRoll',rolledButNotPlayed:'rolledButNotPlayed', pawnMoved:'pawnMoved', turnPlayed:'turnPlayed'};


function RollDice(props) {
	//const [diceValue, setDice] = React.useState("X");

	// React.useEffect(() => {

	// })
	// useValueSetter(setDiceValue, Number(diceValue));
	//useValueSetter(setActivePlayer, props.activePlayer);
	// storeState('diceValue', diceValue);
	let disabled = props.diceValue!=null || props.currentTurnState==TURN_STATES.rolledButNotPlayed;
	return (<React.Fragment>
				<div className="playTurn">
					<button type="button" className="turnButtons" disabled={disabled} onClick={() => {
						let dice = randomDiceValue(); 
						//setDice(dice);
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
		<div> 
			<button className="turnButtons" disabled={disabled} onClick={() => props.updateTurn()}>Done</button>

			<button className="turnButtons" disabled={disabled} onClick={() => props.undoTurn()}>Undo</button>
		</div>
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
					pawnHitStatus:false,
					home: PLAYER_ATTIBUTES[i].home,
					pawnLocs: Array(4).fill(PLAYER_ATTIBUTES[i].home) //initial pawn location is home square
				}
		});
		this.state.playerMessage = null;
		const allPawnLocs = getState("allPawnLocs");
		if(allPawnLocs) {
			for(let k in allPawnLocs) {
				const [pid,i] = k.split("-");
				players[pid].pawnLocs[i] = allPawnLocs[k]; 
			}
		}
		this.state.players = players;
		this.state.currentPlayer = this.state.players[props.currentPlayerIndex];
		this.state.turnPid = randomiseInitialTurn(props.playing.length);
		this.state.diceValue = null;
		this.state.activePlayer =  null;
		if(getState("prevTurn")!=null) {
			this.state.turnPid = players[(Number(getState('prevTurn'))+1) % players.length].pid;
			console.log('setting turn '+this.state.turnPid);
		}
		this.state.currentPlayer.pawnHitStatus = getSessionState("pawnHitStatus")|| false;
	}
	rollHandler(dice) {
		this.state.diceValue=dice;
		prevState = this.state;
		prevState.diceValue = dice;
		prevState.playerMessage = `You rolled ${dice}. Please play your turn then click Done below.`;
		prevState.activePlayer = prevState.currentPlayer;
		prevState.currentTurnState = TURN_STATES.rolledButNotPlayed;
		this.setState(prevState);
	}

	turnPlayedHandler(turnState) {
		prevState =this.state;
		prevState.currentTurnState = turnState;
		prevState.activePlayer =  null;
		storeState("prevTurn", this.state.currentPlayer.pid);
		prevState.turnPid = prevState.players[(this.state.currentPlayer.pid +1) % prevState.players.length].pid;
		const allPawnLocs = getState("allPawnLocs");
		for(let k in allPawnLocs) {
			const [pid,i] = k.split("-");
			if(pid == this.state.currentPlayer.pid) {
				this.state.currentPlayer.pawnLocs[i] = allPawnLocs[k];
			}
		}
		prevState.players[this.state.currentPlayer.pid] = this.state.currentPlayer;
		this.setState(prevState);
	}
	undoTurn() {
		console.log('Will try to undo turn here');
	}
	updateTurn(pawnHitStatus, pawn) {
		prevState =this.state;
		prevState.currentTurnState = TURN_STATES.pawnMoved;
		prevState.activePlayer =  null;
		if (pawnHitStatus) {
			prevState.currentPlayer.pawnHitStatus = true;
			prevState.playerMessage = `You hit a pawn belonging to ${prevState.players[pawn[0]].name}! It has been sent home.`;
			setSessionState("pawnHitStatus", this.state.currentPlayer.pawnHitStatus);

		}		
		this.setState(prevState);
	}
	messageSetter(msg) {
		prevState =this.state;
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
			<Board
				pawnHitStatus = {this.state.currentPlayer.pawnHitStatus}
			 	allPawnLocs={allPawnLocs}
			 	activePlayer={this.state.activePlayer} 
				updateTurn={(pawnHitStatus, pawn) => this.updateTurn(pawnHitStatus, pawn)} 
			 	path={PLAYER_ATTIBUTES[this.state.currentPlayer.pid].path}
			 	diceValue={this.state.diceValue} />
			{yourTurn && <PlayTurn 	currentTurnState={this.state.currentTurnState} undoTurn={()=>this.undoTurn()} updateTurn={() => this.turnPlayedHandler(TURN_STATES.turnPlayed)} />}
			</React.Fragment>
		);

	}

}

export default Game