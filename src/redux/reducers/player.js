import { PLAYER_SET_IS_PLAYING, PLAYER_SET_IS_LOOPED } from '../types';

const initialState = {
	isPlaying: false,
	isLooped: false
}

const playerReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case PLAYER_SET_IS_PLAYING:
			return {
				...state,
				isPlaying: payload
			}

		case PLAYER_SET_IS_LOOPED:
			return {
				...state,
				isLooped: payload
			}

		default: return state;
	}
}

export default playerReducer;