// Версия без redux
import React, { useState } from 'react';
import Fullscreen from "react-full-screen";
import './App.sass';

import { useTitle } from './hooks';
import { Player, Weather } from './components';

// TODO: Сделать приложение PWA
// TODO: Добавить горячие клавиши (В след версии, хотя)

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
	// TODO: Попробовать хранить activeAudio, activeVideo, activeWeather в localStorage
	const [activeAudio, setActiveAudio] = useState(WEATCHERS[0].audio);
	const [activeVideo, setActiveVideo] = useState(WEATCHERS[0].video);
	const [activeWeather, setActiveWeather] = useState(WEATCHERS[0]._id);
	const [playerState, setPlayerState] = useState({
		isPlaying: false, 
		isLooped: false,
		isFullscreen: false
	});

	const changePlayerState = (newState) => {
		setPlayerState({
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



























































// ТЕКУЩАЯ РАБОЧАЯ ВЕРСИЯ

// import React, { useState } from 'react';
// import { connect } from 'react-redux';
// import Fullscreen from "react-full-screen";
// import './App.sass';

// import { playerActions } from './redux/actions';
// import { Player, Weather } from './components';

// // TODO: Сделать приложение PWA


// const WEATCHERS = [
// 	{
// 		_id: '1',
// 		title: 'Дождь',
// 		icon: require('./assets/images/rain.svg'),
// 		audio: require('./assets/sounds/rain.mp3'),
// 		video: require('./assets/video/rain.mp4')
// 	},
// 	{
// 		_id: '2',
// 		title: 'Лето',
// 		icon: require('./assets/images/sun.svg'),
// 		audio: require('./assets/sounds/beach.mp3'),
// 		video: require('./assets/video/beach.mp4')
// 	},
// 	{
// 		_id: '3',
// 		title: 'Метель',
// 		icon: require('./assets/images/cold.svg'),
// 		audio: require('./assets/sounds/rain.mp3'),
// 		video: require('./assets/video/rain.mp4')
// 	},
// 	{
// 		_id: '4',
// 		title: 'Буря',
// 		icon: require('./assets/images/wind.svg'),
// 		audio: require('./assets/sounds/rain.mp3'),
// 		video: require('./assets/video/rain.mp4')
// 	},
// 	{
// 		_id: '5',
// 		title: 'Река',
// 		icon: require('./assets/images/flood.svg'),
// 		audio: require('./assets/sounds/river.mp3'),
// 		video: require('./assets/video/rain.mp4')
// 	},
// 	{
// 		_id: '6',
// 		title: 'Ночь',
// 		icon: require('./assets/images/moon.svg'),
// 		audio: require('./assets/sounds/beach.mp3'),
// 		video: require('./assets/video/beach.mp4')
// 	},
// 	{
// 		_id: '7',
// 		title: 'Лес',
// 		icon: require('./assets/images/park.svg'),
// 		audio: require('./assets/sounds/beach.mp3'),
// 		video: require('./assets/video/beach.mp4')
// 	},
// ]

// // TODO: Сделать полноэкранный режим

// // TODO: Вынести плеер с audio и video в отдельный компонент
// function App({ isPlaying, isLooped, setIsPlaying, setIsLooped }) {
// 	// TODO: Подключить redux и хранить основные данные в сторе (Например текущее время, когда кликаем на паузу) - хотя нужно ли под вопросом

// 	// TODO: Попробовать хранить activeAudio, activeVideo, activeWeather в localStorage
// 	const [activeAudio, setActiveAudio] = useState(WEATCHERS[0].audio);
// 	const [activeVideo, setActiveVideo] = useState(WEATCHERS[0].video);
// 	const [activeWeather, setActiveWeather] = useState(WEATCHERS[0]._id);
// 	const [isFullscreen, setIsFullscreen] = useState(false);
// 	// const [playerState, setPlayerState] = useState({
// 	// 	isPlaying: false, 
// 	// 	isLooped: false
// 	// });
// 	// const [isPlaying, setIsPlaying] = useState(false);
// 	// const [isLooped, setIsLooped] = useState(false);

	
// 	// const changePlayerState = (newState) => {
// 	// 	console.log({
// 	// 		...playerState,
// 	// 		...newState
// 	// 	})
// 	// 	setPlayerState({
// 	// 		...playerState,
// 	// 		...newState
// 	// 	})
// 	// }

// 	const goFull = () => {
// 		setIsFullscreen(!isFullscreen);
// 	}
	
// 	const setWeather = (audio, video, weatherId) => {
// 		if (activeWeather === weatherId) return;
	
// 		// changePlayerState({ isPlaying: false })
// 		setIsPlaying(false);

// 		setActiveWeather(weatherId)
// 		setActiveAudio(audio);
// 		setActiveVideo(video);
// 	}

	
// 	console.log('Родитель обновился')

// 	const setLoop = () => {
// 		setIsLooped(!isLooped)
// 		// changePlayerState({
// 		// 	isLooped: !playerState.isLooped
// 		// })
// 	}

// 	// В чём проблема с isLooped - а в том что когда мы нажимаем на кнопку play - перерисовывается родитель, а следовательно и isLooped сбрасывается
// 	// Решение - Как вариант попробовать сделать объек с состоянием типа { isLooped, isPlaying }

	
	
// 	return (
// 		<Fullscreen
// 			enabled={isFullscreen}
// 			onChange={isFull => setIsFullscreen(isFull)}
// 		>
// 			<div className="App">
				
// 				<Player 
// 					activeAudio={activeAudio}
// 					activeVideo={activeVideo}
// 					// isLooped={isLooped}
// 					// setLoop={setLoop}
// 					// playerState={playerState}
// 					// isPlaying={isPlaying}
					
// 					setIsPlaying={setIsPlaying}
// 					isPlaying={isPlaying}
// 					isLooped={isLooped}
// 					setLoop={setLoop}

// 					goFull={goFull}
// 					isFullscreen={isFullscreen}
// 					// changePlayerState={changePlayerState}
// 				/>
				

// 				<div className="App__weather">
// 					{/* TODO: Получать их с сервера и выводить циклом */}

// 					{ WEATCHERS.map(item => {
// 						return (
// 							<Weather 
// 								key={ item._id }
// 								activeWeather={ activeWeather }
// 								setWeather={ setWeather }
// 								item={ item }
// 							/>
// 						)
// 					}) }
// 				</div>

				

// 				{/* <div className="App__controls">
// 					<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить">
// 						<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
// 						<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
// 						C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
// 						c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
// 						c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
// 						c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
// 						c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
// 						C373.891,156.837,370.527,144.907,361.093,139.623z"/>
// 						<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
// 						c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
// 					</svg>
// 					</button>
// 					<button className="Button" title="Следующий">
// 						<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M15.5001 8.13397C16.1667 8.51887 16.1667 9.48112 15.5001 9.86602L2.00006 17.6602C1.33339 18.0451 0.500061 17.564 0.500061 16.7942L0.500062 1.20576C0.500062 0.43596 1.3334 -0.0451642 2.00006 0.339736L15.5001 8.13397Z"/>
// 							<path d="M17.9167 1.89582C17.9167 1.263 17.4037 0.749991 16.7709 0.749991C16.1381 0.749991 15.6251 1.263 15.6251 1.89582V16.1042C15.6251 16.737 16.1381 17.25 16.7709 17.25C17.4037 17.25 17.9167 16.737 17.9167 16.1042V1.89582Z"/>
// 						</svg>
// 					</button>
// 					<button className="Button" title="Предыдущий">
// 						<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M2.41667 8.13398C1.75 8.51888 1.75 9.48113 2.41667 9.86603L15.9167 17.6603C16.5833 18.0452 17.4167 17.564 17.4167 16.7942V1.20577C17.4167 0.435972 16.5833 -0.0451528 15.9167 0.339747L2.41667 8.13398Z"/>
// 							<path d="M0 1.89584C0 1.26301 0.513007 0.750002 1.14583 0.750002C1.77866 0.750002 2.29167 1.26301 2.29167 1.89584V16.1042C2.29167 16.737 1.77866 17.25 1.14583 17.25C0.513007 17.25 0 16.737 0 16.1042V1.89584Z"/>
// 						</svg>		
// 					</button>
// 				</div> */}

// 			</div>
// 		</Fullscreen>
// 	);
// }

// export default connect(
// 	({ player }) => ({ isPlaying: player.isPlaying, isLooped: player.isLooped }),
// 	playerActions
// )(App);