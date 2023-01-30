import React from 'react';
import ReactDOM from 'react-dom/client';
import {Pawn} from './Player';
function Square(props) {
	return (
			<div className={`${props.id} square ${props.rowClass}`}> <div className="hideName">{props.id} </div> {props.children} </div>
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
		console.log(this.state.squarePawnPos)
	}
	renderPawn(sq) {
		if (this.state.squarePawnPos.hasOwnProperty(sq)) {
			let pawns = this.state.squarePawnPos[sq];
			let pawnList = [];
			pawns.forEach(p => {
				let ps = p.split("-");
				pawnList.push(<Pawn key={p} id={ps[1]} pid={ps[0]} />)
			});
			return pawnList;
		}
	}
	render() {
		let squareList = [];
		this.state.squares.forEach((s,i)=> {
			squareList.push(<Square  key={i+1} id={s}>{this.renderPawn(s)}</Square>)
		});
		return (
			<div className='board'>
			 <React.Fragment>
			 	{squareList}
				
			  </React.Fragment>
			</div>
			);
	}
}
export default Board;