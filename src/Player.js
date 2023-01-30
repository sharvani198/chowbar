import React from 'react';
import ReactDOM from 'react-dom/client';

function Pawn(props) {
	return (
		<span className={`pawns pawn${props.pid}`} id={props.id}>{props.id}</span>
	);
}
class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pl: props.pid,
			pawnState: [],
			home: props.home,
			isTurn: props.turnPid==props.pid
		}
		props.pawnLocs.forEach((l,i) => {
			this.state.pawnState.push({pl:props.pid, id:i, loc: l});			
		});
	}
	render() {
		let pawnList = [];
		this.state.pawnState.forEach(p => {
			pawnList.push(<Pawn key={p.id+1} id={p.id} pid={p.pl} loc={p.loc} />)
		});

		return (
			<React.Fragment>
				{this.state.isTurn? (<div>My turn!!!!</div>):(<div></div>)}
			</React.Fragment>
		); 
	}
}

export {Player, Pawn};