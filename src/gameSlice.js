import {createSlice} from '@reduxjs/toolkit';

export const gameSlice = createSlice({
	name: 'game',
	initialState: {
			currentPlayer: null,
			diceValue: null,
			activePlayer: null,
			allPawnLocs: {},
		
	},
	reducers: {
		setCurrentPlayer: (state, p) => {
			state.currentPlayer = p.payload;
		},
		setDiceValue: (state, dice) => {
			state.diceValue = dice.payload;
		},
		setActivePlayer: (state, p) => {
			state.activePlayer = p.payload;
		},
		setAllPawnLocs: (state, pawnLocs) => {
			state.allPawnLocs = pawnLocs.payload;
		}
	}
});

export const { setCurrentPlayer, setDiceValue, setActivePlayer, setAllPawnLocs} = gameSlice.actions;

