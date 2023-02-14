import React from 'react';
import ReactDOM from 'react-dom/client';
import {Pawn} from './Player';
import {storeState, getState} from './utils'

const HOME_SQUARES = ["square02", "square42", "square20", "square24"];
const WIN_SQUARE = "square22";

function Square(props) {

	return (
			<div className={`${props.id} ${props.highlight} square ${props.rowClass}`} onClick={()=> props.squareClick()}> <div className="hideName">{props.id} </div> {props.children} </div>
		);
}
let unDoableState;
class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
		let squares = [];
		for (let i = 0; i<5;i++) {
			for (let j=0;j<5;j++) {
				squares.push("square"+i+j);
			}
		}
		this.state.squares = squares;

		let squarePawnPos = {}
		for( let k of Object.keys(props.allPawnLocs)) {
			if (squarePawnPos.hasOwnProperty(props.allPawnLocs[k])) {
				squarePawnPos[props.allPawnLocs[k]].push(k);			
			} else {
				squarePawnPos[props.allPawnLocs[k]] = [k];
			} 
		}
		this.state.squarePawnPos = squarePawnPos;
		this.state.pawnCanMove = {}
		//console.log(this.state.squarePawnPos)
	}
	newSquare(sq,inc) {
		let pathIndex = this.props.path.indexOf(sq.split("square")[1]);
		if(pathIndex>15 && this.props.pawnHitStatus==false) { //this is the inner squares which need a pawn hit.
				console.log("YOU can't enter the inner square without hitting a pawn first.")
			} else {
				pathIndex = pathIndex+inc;
		}
		let newLoc = this.props.path[pathIndex]; 
		return newLoc;
	}
	pawnMover(p,isActive,sq) {
		let pawnCanMove = {}
		if(isActive) {
			let newSq = this.newSquare(sq,Number(this.props.diceValue));
			console.log(`${p} is at ${sq} and can move to ${newSq}`);
			pawnCanMove["square"+newSq] = p+"|"+sq;
		}
		let prevState = this.state;
		prevState.pawnCanMove = pawnCanMove;
		this.setState(prevState);

	}
	renderPawns(sq) {
		if (this.state.squarePawnPos.hasOwnProperty(sq)) {
			let pawns = this.state.squarePawnPos[sq];
			let pawnList = [];
			pawns.forEach(p => {
				const [plid, pwid] = p.split("-"); // coz it is playerId-pawnId
				const isActive = this.props.activePlayer && this.props.activePlayer.pid==Number(plid);
				let pawnEle = <Pawn 
								pawnClick={() => this.pawnMover(p,isActive,sq)} 
								activeClass={isActive?"activePawn":""} 
								key={p} 
								id={pwid} 
								plid={plid} />
				pawnList.push(pawnEle)
			});
			return pawnList;
		}
	}
	checkPawnHit(p, sq) {
		let pawns = this.state.squarePawnPos[sq];
		if (pawns.length<1) {
			return false;
		}
		if (sq==WIN_SQUARE || HOME_SQUARES.indexOf(sq)!=-1) {
			return false; // no hitting in these squares
		}
		const diffPlayerPawns = pawns.filter((ps) => ps[0]!=p);
		return diffPlayerPawns.length>0;
	}
	sendPawnHome(sqPos, sq) {
		const pawn = sqPos[sq][0];
		let sqPosChanged = sqPos;
		const [pid,id] = pawn.split("-");
		sqPosChanged[HOME_SQUARES[Number(pid)]].push(pawn);
		sqPosChanged[sq] = sqPos[sq].filter((i)=>i!==pawn);
		console.log(sqPosChanged);
		return sqPosChanged;
	}
	movePawn(p, oldSq, newSq) {
		//add game conditions here .
		let sqPos = this.state.squarePawnPos;
		let pawnHit = false;
		if (sqPos.hasOwnProperty(newSq)) {
			let hit = this.checkPawnHit(p[0], newSq)!=false
			if(hit!=false) {
				console.log( p+" HIT PAWN "+sqPos[newSq][0]+" at "+newSq);
				pawnHit = true;
				sqPos = this.sendPawnHome(sqPos, newSq);
			}
			sqPos[newSq].push(p);			
		} else {
			sqPos[newSq] = [p];
		}

		sqPos[oldSq] = sqPos[oldSq].filter((i)=>i!==p);
		if (sqPos[oldSq].length==0) {
		 	delete sqPos[oldSq];
		}
		let prevState = this.state;
		unDoableState = prevState;
		prevState.squarePawnPos = sqPos;
		prevState.pawnHit = pawnHit;
		this.setState(prevState);
		this.props.updateTurn(pawnHit, sqPos[newSq]?sqPos[newSq][0]:null);
		let allPanLocs = {}
		for( let s of Object.keys(sqPos)) {
			sqPos[s].forEach((l)=> allPanLocs[l]=s);
		}
		storeState("allPawnLocs", allPanLocs);
	}
	undo() {
		console.log(unDoableState)
	}
	handleSquareClick(sq){
		if (this.state.pawnCanMove.hasOwnProperty(sq)) {
			const [p,oldSq] = this.state.pawnCanMove[sq].split("|");
			console.log(`moving ${p}from ${oldSq} to ${sq}`);
			this.movePawn(p, oldSq, sq )
			delete this.state.pawnCanMove[sq];
		}
	}

	render(props) {
		let squareList = [];
		this.state.squares.forEach((s,i)=> {
			squareList.push(<Square highlight={this.state.pawnCanMove[s]?"highlight":""} 
									squareClick={() => this.handleSquareClick(s)} 
									key={i+1} 
									id={s}>
										{this.renderPawns(s)}
							</Square>)
		});
		return (
			<div className='board'>
			 <React.Fragment>
			 	<div className="squares">
			 	{squareList}
				</div>				
			  </React.Fragment>
			</div>
			);
	}
}
export default Board;