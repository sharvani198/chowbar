import React from 'react';
import {setCurrentPlayer, setDiceValue} from './gameSlice.js'
import {useSelector, useDispatch} from 'react-redux';

export const storeState = (k,v) => {
  localStorage.setItem(k, JSON.stringify(v));
}
export const getState = (k) => {
  return JSON.parse(localStorage.getItem(k));
}

export const StateSlice = (props) => {
  const game = useSelector(state => state.game);
  const dispatch = useDispatch();
  dispatch(setCurrentPlayer(props.currentPlayer));    
}
export const useDiceDispatch = (diceValue) => {
  const dispatch = useDispatch();
  dispatch(setDiceValue(diceValue));
}

export const useDiceValue = () => {
  const game = useSelector(state => state.game);
  return game.diceValue;
}
export const randomiseInitialTurn = (numOfPlayers) => {
  return Math.floor(Math.random()*numOfPlayers);
}

const DICE_VALUES = [1,2,3,4,8];

export const randomDiceValue = () => {
  return DICE_VALUES[Math.floor(Math.random()*DICE_VALUES.length)];
}
