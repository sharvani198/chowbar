import {configureStore} from '@reduxjs/toolkit'
import {gameSlice} from './gameSlice.js'

export default configureStore({
	reducer: {
		game: gameSlice.reducer
	}
});