import React, { useState } from 'react';
import Fullscreen from "react-full-screen";
import './App.sass';

import { useTitle } from './hooks';
import { Player } from './components';

const WEATCHERS = [
	{
		_id: '1',
		title: 'Дождь',
		icon: require('./assets/images/rain.svg'),
		// audio: require('./assets/sounds/rain.mp3'),
		audio: 'https://doc-04-b8-docs.googleusercontent.com/docs/securesc/0in1fc1s1knjp2m88fk06os2qv0gqcta/grjmof1u0mnspm8is7baaru09l629203/1587201450000/09977035601748835640/09977035601748835640/1NHUqCknady3cvg7iVFIGZUfN3ILGKSEn?e=download&authuser=0&nonce=h89vau5de08d2&user=09977035601748835640&hash=pa0rtdbujeda4nqh1n427gn6oenongu9',
		// audio: 'https://cdndl.mp3party.net/track/6821381/+hy4JVINk74O6bx5kWLKSkIvdUPCGmqaIyfdJx30WvF0p/SZwBwxFD/StMdeKEaqA/Ge9n5B8wCZaOcKxXb/2pwzxtekS+VoPALsIX/wIENfKglMPEN5DYqrsbgRt0LHwn0d/T/KI03XxQm4OEu7vzZuz2KPjRZvpEjaZtQKC7SBDNXmDVll/atc0Wog2r+JehLjnmF8aQwu1w8QB+hCEbSLTmEiBkxCIwwHBl6nAI8zZSbH8BGec5hiaYYpyil+eGE+n5pT9xLgkF94Z0N8dE6RMpZaKfOo4Ts7opGugJfvsXyxM8/0Mmrs/grHPaSZzLS7zTst1Lkvzp1T83C0t3NUSWNPBvxxJUFmgscvGj4=',
		// audio: require('./assets/sounds/test.mp3'),
		video: require('./assets/video/rain.mp4')
	},
	{
		_id: '2',
		title: 'Лето',
		icon: require('./assets/images/sun.svg'),
		// audio: require('./assets/sounds/beach.mp3'),
		audio: 'https://doc-14-b8-docs.googleusercontent.com/docs/securesc/0in1fc1s1knjp2m88fk06os2qv0gqcta/vqcg0dpr9m5jqju6abh4n73ieatmh834/1587201300000/09977035601748835640/09977035601748835640/1R7ODr52C4by5NFvaamLh42DWNC9oDwMu?e=download&authuser=0',
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

// TODO: Всё-таки загрузить файлы на google диск - или куда-нибудь ещё
// Можно подзапариться и сделать прелоадер, показывающийся до того как аудио запустится (до срабатывания canplay. Смотреть в сторону loadstart). Сделать в виде анимированного бара мэйби
// TODO: Сделать тоже самое что делал для аудио и для видео (canplay и тд)
// А воообще было бы ещё круче подробить все элементы на микрокомпонентики
// Решить проблему Uncaught (in promise) DOMException: The play() request was interrupted by a new load request. // Возникает в билде когда меняю погоду // Скорее всего из за того, что аудио надо паузить перед загрузкой нового, так как он в состоянии плей а мы меняем ему url
// И вообще может лучше при клике на погоду делать запрос на сервер за получением аудио (хотя зачем, когда url-ы есть)

function App() {
	const [activeAudio, setActiveAudio] = useState(WEATCHERS[0].audio);
	const [activeVideo, setActiveVideo] = useState(WEATCHERS[0].video);
	const [activeWeather, setActiveWeather] = useState(WEATCHERS[0]._id);
	const [playerState, setPlayerState] = useState({
		isPlaying: false, 
		isLooped: false,
		isFullscreen: false,
		isLoaded: false,
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

		setActiveWeather(weatherId)
		setActiveAudio(audio);
		// setActiveVideo(video);
		changePlayerState({ isPlaying: false })
	}
	// console.log('Родитель обновился')

	const setLoop = () => {
		changePlayerState({
			isLooped: !playerState.isLooped
		})
	}

	useTitle("Relax App");

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

					setWeather={setWeather}
					items={WEATCHERS}
					activeWeather={activeWeather}
				/>
				
				{/* <div className="App__weather">
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
				</div> */}
			</div>
		</Fullscreen>
	);
}

export default App;


































// import React, { useState } from 'react';
// import Fullscreen from "react-full-screen";
// import './App.sass';

// import { useTitle } from './hooks';
// import { Player, Weather } from './components';

// // TODO: Сделать приложение PWA

// const WEATCHERS = [
// 	{
// 		_id: '1',
// 		title: 'Дождь',
// 		icon: require('./assets/images/rain.svg'),
// 		// audio: require('./assets/sounds/rain.mp3'),
// 		audio: 'https://cdndl.mp3party.net/track/6821381/+hy4JVINk74O6bx5kWLKSkIvdUPCGmqaIyfdJx30WvF0p/SZwBwxFD/StMdeKEaqA/Ge9n5B8wCZaOcKxXb/2pwzxtekS+VoPALsIX/wIENfKglMPEN5DYqrsbgRt0LHwn0d/T/KI03XxQm4OEu7vzZuz2KPjRZvpEjaZtQKC7SBDNXmDVll/atc0Wog2r+JehLjnmF8aQwu1w8QB+hCEbSLTmEiBkxCIwwHBl6nAI8zZSbH8BGec5hiaYYpyil+eGE+n5pT9xLgkF94Z0N8dE6RMpZaKfOo4Ts7opGugJfvsXyxM8/0Mmrs/grHPaSZzLS7zTst1Lkvzp1T83C0t3NUSWNPBvxxJUFmgscvGj4=',
// 		// audio: require('./assets/sounds/test.mp3'),
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
// 		title: 'Костёр',
// 		icon: require('./assets/images/fire.svg'),
// 		// audio: 'https://zvukipro.com/uploads/files/2018-12/1544511362_les-groza-koster-priroda.mp3',
// 		audio: require('./assets/sounds/fire.mp3'),
// 		video: require('./assets/video/fire.mp4')
// 	},
// 	{
// 		_id: '4',
// 		title: 'Река',
// 		icon: require('./assets/images/flood.svg'),
// 		audio: require('./assets/sounds/river.mp3'),
// 		video: require('./assets/video/river.mp4')
// 	}
// ]

// // TODO: Всё-таки загрузить файлы на google диск - или куда-нибудь ещё
// // Можно подзапариться и сделать прелоадер, показывающийся до того как аудио запустится (до срабатывания canplay. Смотреть в сторону loadstart). Сделать в виде анимированного бара мэйби
// // TODO: Сделать тоже самое что делал для аудио и для видео (canplay и тд)

// function App() {
// 	const [activeAudio, setActiveAudio] = useState(WEATCHERS[0].audio);
// 	const [activeVideo, setActiveVideo] = useState(WEATCHERS[0].video);
// 	const [activeWeather, setActiveWeather] = useState(WEATCHERS[0]._id);
// 	const [playerState, setPlayerState] = useState({
// 		isPlaying: false, 
// 		isLooped: false,
// 		isFullscreen: false,
// 		isLoaded: false,
// 		isCanPlay: false
// 	});

// 	const changePlayerState = (newState) => {
// 		return setPlayerState({
// 			...playerState,
// 			...newState
// 		})
// 	}

// 	const goFull = () => {
// 		changePlayerState({
// 			isFullscreen: !playerState.isFullscreen
// 		})
// 	}

// 	const setIsPlaying = (isPlaying) => {
// 		changePlayerState({
// 			isPlaying: isPlaying
// 		})
// 	}

// 	const setIsCanPlay = (canPlay) => {
// 		console.log('CAN PLAY')
// 		changePlayerState({
// 			isCanPlay: canPlay
// 		})
// 	}
	
// 	const setWeather = (audio, video, weatherId) => {
// 		if (activeWeather === weatherId) return;
	
// 		setActiveWeather(weatherId)
// 		setActiveAudio(audio);
// 		setActiveVideo(video);
// 		changePlayerState({ isPlaying: false })
// 	}
// 	// console.log('Родитель обновился')

// 	const setLoop = () => {
// 		changePlayerState({
// 			isLooped: !playerState.isLooped
// 		})
// 	}

// 	useTitle("Relax App");

// 	return (
// 		<Fullscreen
// 			enabled={playerState.isFullscreen}
// 			onChange={isFull => changePlayerState({ isFullscreen: isFull })}
// 		>
// 			<div className="App">
// 				<Player 
// 					activeAudio={activeAudio}
// 					activeVideo={activeVideo}
					
// 					setIsPlaying={setIsPlaying}
// 					isPlaying={playerState.isPlaying}
// 					setIsCanPlay={setIsCanPlay}
// 					isCanPlay={playerState.isCanPlay}

// 					setLoop={setLoop}
// 					isLooped={playerState.isLooped}

// 					goFull={goFull}
// 					isFullscreen={playerState.isFullscreen}
// 				/>
				
// 				<div className="App__weather">
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
// 			</div>
// 		</Fullscreen>
// 	);
// }

// export default App;
