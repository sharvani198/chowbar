import {createSlice} from '@reduxjs/toolkit';

export const gameSlice = createSlice({
	name: 'game',
	initialState: {
			numOfPlayers: null,
			currentPlayer: null,
			playersFree:null,
			diceValue: null
		
	},
	reducers: {
		setNumOfPlayers: (state, num) => {
			state.numOfPlayers = num.payload;
		},
		setCurrentPlayer: (state, p) => {
			state.currentPlayer = p.payload;
		},
		setPlayersFree: (state, pls) => {
			state.playersFree = pls.payload;
		},
		setDiceValue: (state, dice) => {
			state.diceValue = dice.payload;
		}
	}
});

export const { setNumOfPlayers, setCurrentPlayer, setPlayersFree, setDiceValue} = gameSlice.actions;

