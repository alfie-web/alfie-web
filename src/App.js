// Версия без redux
import React, { useState } from 'react';
import Fullscreen from "react-full-screen";
import './App.sass';

import { useTitle } from './hooks';
import { Player, Weather } from './components';

// TODO: Сделать приложение PWA

const WEATCHERS = [
	{
		_id: '1',
		title: 'Дождь',
		icon: require('./assets/images/rain.svg'),
		audio: require('./assets/sounds/rain.mp3'),
		video: require('./assets/video/rain.mp4')
	},
	{
		_id: '2',
		title: 'Лето',
		icon: require('./assets/images/sun.svg'),
		audio: require('./assets/sounds/beach.mp3'),
		video: require('./assets/video/beach.mp4')
	},
	{
		_id: '3',
		title: 'Костёр',
		icon: require('./assets/images/fire.svg'),
		// audio: 'https://zvukipro.com/uploads/files/2018-12/1544511362_les-groza-koster-priroda.mp3',
		audio: require('./assets/sounds/fire.mp3'),
		video: require('./assets/video/fire.mp4')
	},
	{
		_id: '4',
		title: 'Река',
		icon: require('./assets/images/flood.svg'),
		audio: require('./assets/sounds/river.mp3'),
		video: require('./assets/video/river.mp4')
	}
]

function App() {
	const [activeAudio, setActiveAudio] = useState(WEATCHERS[0].audio);
	const [activeVideo, setActiveVideo] = useState(WEATCHERS[0].video);
	const [activeWeather, setActiveWeather] = useState(WEATCHERS[0]._id);
	const [playerState, setPlayerState] = useState({
		isPlaying: false, 
		isLooped: false,
		isFullscreen: false
	});

	const changePlayerState = (newState) => {
		return setPlayerState({
			...playerState,
			...newState
		})
	}

	const goFull = () => {
		changePlayerState({
			isFullscreen: !playerState.isFullscreen
		})
	}

	const setIsPlaying = (isPlaying) => {
		changePlayerState({
			isPlaying: isPlaying
		})
	}
	
	const setWeather = (audio, video, weatherId) => {
		if (activeWeather === weatherId) return;
	
		changePlayerState({ isPlaying: false })
		setActiveWeather(weatherId)
		setActiveAudio(audio);
		setActiveVideo(video);
	}
	// console.log('Родитель обновился')

	const setLoop = () => {
		changePlayerState({
			isLooped: !playerState.isLooped
		})
	}

	useTitle("Relax app");

	return (
		<Fullscreen
			enabled={playerState.isFullscreen}
			onChange={isFull => changePlayerState({ isFullscreen: isFull })}
		>
			<div className="App">
				<Player 
					activeAudio={activeAudio}
					activeVideo={activeVideo}
					
					setIsPlaying={setIsPlaying}
					isPlaying={playerState.isPlaying}

					setLoop={setLoop}
					isLooped={playerState.isLooped}

					goFull={goFull}
					isFullscreen={playerState.isFullscreen}
				/>
				
				<div className="App__weather">
					{ WEATCHERS.map(item => {
						return (
							<Weather 
								key={ item._id }
								activeWeather={ activeWeather }
								setWeather={ setWeather }
								item={ item }
							/>
						)
					}) }
				</div>
			</div>
		</Fullscreen>
	);
}

export default App;