import React from 'react';
import {gameSlice} from './gameSlice.js'
import {useSelector, useDispatch} from 'react-redux';


const DICE_VALUES = [1,2,3,4,8];

export const randomDiceValue = () => {
  return DICE_VALUES[Math.floor(Math.random()*DICE_VALUES.length)];
}
export const randomiseInitialTurn = (numOfPlayers) => {
  return Math.floor(Math.random()*numOfPlayers);
}


//local storage functions
export const storeState = (k,v) => {
  localStorage.setItem(k, JSON.stringify(v));
}
export const getState = (k) => {
  return JSON.parse(localStorage.getItem(k));
}


//session sotrage fucntions
export const setSessionState = (k,v) => {
    sessionStorage.setItem(k, v);
};
export const getSessionState = (k) => {
    return sessionStorage.getItem(k);
};

//redux state functions
export const useValueSetter = (action, prop) => {
  const dispatch = useDispatch();
  dispatch(action(prop));
}
export const useValueGetter = (value) => {
  const game = useSelector(state => state.game);
  return game[value];
}

export const {setCurrentPlayer, setDiceValue, setActivePlayer} = gameSlice.actions

