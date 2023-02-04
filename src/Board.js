import React from 'react';
import ReactDOM from 'react-dom/client';
import {Pawn} from './Player';
import {useValueGetter} from './utils'

function Square(props) {

	return (
			<div className={`${props.id} ${props.highlight} square ${props.rowClass}`} onClick={()=> props.squareClick()}> <div className="hideName">{props.id} </div> {props.children} </div>
		);
}
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
		return this.props.path[this.props.path.indexOf(sq.split("square")[1])+inc];
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
	movePawn(p, oldSq, newSq) {
		//add game conditions here .
		let sqPos = this.state.squarePawnPos;
		
		if (sqPos.hasOwnProperty(newSq)) {
			sqPos[newSq].push(p);			
		} else {
			sqPos[newSq] = [p];
		}

		sqPos[oldSq] = sqPos[oldSq].filter((i)=>i!==p);
		if (sqPos[oldSq].length==0) {
		 	delete sqPos[oldSq];
		}
		let prevState = this.state;
		prevState.squarePawnPos = sqPos;
		this.setState(prevState);
		this.props.updateTurn();
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