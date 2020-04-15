import { PLAYER_SET_IS_PLAYING, PLAYER_SET_IS_LOOPED } from '../types';

const playerActions = {
	setIsPlaying: isPlaying => ({
		type: PLAYER_SET_IS_PLAYING,
		payload: isPlaying
	}),
	setIsLooped: isLooped => ({
		type: PLAYER_SET_IS_LOOPED,
		payload: isLooped
	}),
}

export default playerActions;