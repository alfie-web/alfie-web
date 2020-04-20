//  Основная рерсия без waiting и тд (РАБОТАЕТ)
import React, { Fragment, useState, createRef, useEffect } from 'react';
import classNames from 'classnames';

const trackRef = createRef();
const progressRef = createRef();
const audioRef = createRef();
const videoRef = createRef();
const timeRef = createRef();

// TODO: Попробовать вынести fakeDuration в родителя

// let outlineLength = null;
// let progressLength = null;

// TODO: А по хорошему надо сделать проверки на существование видео и аудиофайла
function Player({ 
	playerState,
	setIsPlaying, 
	setLoop, 
	setFullscreen, 
	setIsCan,
	setIsEnded,
}) {
	const [fakeDuration, setFakeDuration] = useState(600);
	const [outlineLength, setOutlineLength] = useState(null);
	const [progressLength, setProgressLength] = useState(null);

	const { activeAudio, activeVideo, isPlaying, isLooped, isFullscreen, isCan, isEnded } = playerState;

	const resetTime = () => {
		console.log('resetTime')
		audioRef.current.currentTime = 0;
		videoRef.current.currentTime = 0;
	}

	const setDuration = duration => {
		resetTime()		// Здесь тоже произойдёт timeupdate
		setFakeDuration(duration);
		// setBarsLength();
	}

	const toTimeFormat = num => {
		return (+num >= 0 && +num <= 9) ? '0' + num : num;
	}

	const stopSound = () => {
		if (isPlaying) {
			console.log('stop sound')
			audioRef.current.pause();
			videoRef.current.pause();
			setIsPlaying(false);
		}
	}

	// const playSound = useCallback(() => {
	const playSound = () => {
		if (!isPlaying) {
			audioRef.current.play()
				.then(() => {
					videoRef.current.play()
						.then(() => {
							setIsPlaying(true);
						})
				})
		}
	}

	const playPauseSound = () => {
		if (isPlaying) {
			stopSound();
		} else {
			playSound();
		}
	}

	const onEnd = () => {
		resetTime();
		setIsEnded(false);
		
		if (isLooped) {
			console.log('Зациклено', isLooped)
			// playSound();
			audioRef.current.play()
			// videoRef.current.play()
		} else {
			console.log('Не зациклено', isLooped)
			stopSound();
		}
		
		// setIsPlaying(false);
	}

	const handleEnd = () => {
		console.log('ENDED')
		setIsEnded(true);
	}

	const onPlay = () => {
		console.log('onPlay')
		let currentTime = audioRef.current.currentTime;
		let elapsedTime = fakeDuration - currentTime;

		let seconds = Math.floor(elapsedTime % 60);
		let minutes = Math.floor(elapsedTime / 60);
		timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;

		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
		trackRef.current.style.strokeDashoffset = progress;

		// if (currentTime >= fakeDuration) {
		if (currentTime >= fakeDuration || audioRef.current.ended) {
			handleEnd();
		}
	}

	// TODO: Сбрасывать бар когда выбираю время, или делается ресет	(Оказалось сложновато, как вариант можно прятать бар, когда трек полностью загружен)
	// Ну или хранить loadedTime в стэйте, чего не очень хочется ибо это ререндеры
	// А может вообще вынести бары из стейта в глобальные переменные?
	const onProgress = (e) => {
		console.log('progress')
		// if (audioRef.current.readyState !== 0) {	// Без этого buffered почемуто выдаёт ошибку
		if (e.target.buffered.length > 0) {	// Без этого buffered почемуто выдаёт ошибку
		// if (audioRef.current.buffered.length > 0) {	// Без этого buffered почемуто выдаёт ошибку
			var loadedTime = e.target.buffered.end(0);
			console.log(loadedTime);
		
			let progress = progressLength - (loadedTime / fakeDuration) * progressLength;
			progressRef.current.style.strokeDashoffset = progress;
		}
	}

	const handleHotKeys = (e) => {
		e.preventDefault();
		// console.log(e.keyCode)
		switch (e.keyCode) {
			case 32:	// Space
				playPauseSound();
				break;
			case 70:	// F
				setFullscreen();
				break;
			case 76:	// L
				setLoop();
				break;
			case 49:	// 1
				setDuration(120);
				break;
			case 50:	// 2
				setDuration(300);
				break;
			case 51:	// 3
				setDuration(600);
				break;
			default:  return;
		}
	}

	// const checkCanPlay = () => {
	// 	console.log('Can Play');
	// 	if (isPlaying) {
	// 		// audioRef.current.play()
	// 		playSound();
	// 	}
	// 	// Также нужно проверять на isLooped, так как запускается даже если false
	// 	// setIsCan(true);
	// 	// if (isPlaying) playSound();	// TODO: Подумать как сделать так, чтобы по клику на weather не запускалось сразу  (Глазком глянуть на события playing и waiting, но думаю до этого не дойдёт)
	// }

	// const setWaiting = () => {
	// 	console.log('Waiting')
	// 	setIsCan(false);
	// }


// 	// устанавливаю ширину bar-а изначально 
	useEffect(() => {
		let length = trackRef.current.getTotalLength()
		setOutlineLength(length);
		setProgressLength(length);
		trackRef.current.style.strokeDasharray = length;
		trackRef.current.style.strokeDashoffset = length;
		progressRef.current.style.strokeDasharray = length;
		progressRef.current.style.strokeDashoffset = length;
	// })
	}, [setOutlineLength, setProgressLength])
	


	useEffect(() => {
		audioRef.current.load();
		videoRef.current.load();
		console.log('LOADED')
		// И вот тут как раз надо делать setIsCan(true)		Если он вообще понадобится, думаю playing ну и waiting -достаточно

	}, [activeAudio])


	useEffect(() => {
		if (isEnded) {
			onEnd();
		}
	})

	const setWaiting = () => {
		console.log('WAITING')
		setIsCan(false);
	}

	const setReadyToPlay = () => {
		console.log('READY TO PLAY')
		if (!isCan) {
			setIsCan(true);
		}
	}

	// Может тоже порефакторить
	useEffect(() => {
		// TODO: Когда происходит это событие, нужно блокировать кнопки выбора погоды, так как вылазиет ошибка. (Так как аудио проигрывается формально, хоть и waiting, но мы его нарушаем меняя url аудио)
		let ref = audioRef.current;
		ref.addEventListener('waiting', setWaiting);
		return () => ref.removeEventListener('waiting', setWaiting);
	})

	useEffect(() => {
		let ref = audioRef.current;
		ref.addEventListener('canplay', setReadyToPlay);	// playing
		return () => ref.removeEventListener('canplay', setReadyToPlay);
	})

	useEffect(() => {
		const ref = audioRef.current;
		ref.addEventListener('timeupdate', onPlay);
		return () => ref.removeEventListener('timeupdate', onPlay);
	})

	useEffect(() => {
		const ref = audioRef.current;
		ref.addEventListener('progress', onProgress);
		return () => ref.removeEventListener('progress', onProgress);
	})

	useEffect(() => {
		document.addEventListener('keydown', handleHotKeys);
		return () => document.removeEventListener('keydown', handleHotKeys);
	})



	useEffect(() => {
		const ref = audioRef.current;
		ref.addEventListener('error', (e) => {
			alert('Ошибка: ' + ref.error + ', ' + ref.error.message + ', ' + ref.error.code)
			alert(ref.error.code)
			ref.load();
		});
		return () => ref.removeEventListener('error', (e) => {
			alert('Ошибка: ' + ref.error + ', ' + ref.error.message + ', ' + ref.error.code)
			alert(ref.error.code)
			ref.load();
		});
	})


	

	return (
		<Fragment>
			<div className="App__video">
				<video ref={videoRef} preload="none" src={activeVideo} loop></video>
			</div>

			<div className="App__player">
				<div className="App__player-track">
					<button onClick={ playPauseSound } className="Button Button--active" title={ isPlaying ? 'Отстановить [Пробел]' : 'Проигрывать [Пробел]' }>
						{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
							<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
							<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
						</svg> 
						: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
						</svg>
					}
					</button>
					<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle className={ classNames({ 'waiting': !isCan }) } cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
					</svg>
					<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
					</svg>
					<svg className="progress-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle ref={progressRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
					</svg>
				</div>
				<audio ref={audioRef} preload="none" src={activeAudio}></audio>
				<h1 ref={timeRef} className="App__player-time">00:00</h1>
			</div>

			<div className="App__times">
				<button className={ classNames('Button', { 'Button--active': fakeDuration === 15 }) } title="2 минуты [1]" name="15" onClick={() => setDuration(15)}>2 минуты</button>
				<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут [2]" name="300" onClick={() => setDuration(300)}>5 минут</button>
				<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут [3]" name="600" onClick={() => setDuration(600)}>10 минут</button>
			</div>

			<div className="App__controls">
				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить [L]">
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
					<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
					C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
					c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
					c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
					c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
					c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
					C373.891,156.837,370.527,144.907,361.093,139.623z"/>
					<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
					c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
				</svg>
				</button>
				<button className="Button" title={ !isFullscreen ? "Во весь экран [F]" : "Выход из полноэкранного режима [F]" } onClick={setFullscreen}>
					{ isFullscreen ? <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 9.75C21.6904 9.75 22.25 9.19035 22.25 8.5C22.25 7.80964 21.6904 7.25 21 7.25L21 9.75ZM16.5 8.50001L16.5 9.75001L16.5 9.75001L16.5 8.50001ZM14.5 6.50001L15.75 6.50001L15.75 6.50001L14.5 6.50001ZM15.75 2C15.75 1.30964 15.1904 0.75 14.5 0.75C13.8096 0.75 13.25 1.30964 13.25 2L15.75 2ZM1.5 13.75C0.809646 13.75 0.250001 14.3097 0.25 15C0.249999 15.6904 0.809642 16.25 1.5 16.25L1.5 13.75ZM6 15L6 16.25H6V15ZM8 17L9.25 17V17H8ZM6.75 21.5C6.75 22.1904 7.30964 22.75 8 22.75C8.69036 22.75 9.25 22.1904 9.25 21.5L6.75 21.5ZM21 7.25L16.5 7.25001L16.5 9.75001L21 9.75L21 7.25ZM15.75 6.50001L15.75 2L13.25 2L13.25 6.50001L15.75 6.50001ZM16.5 7.25001C16.0858 7.25001 15.75 6.91422 15.75 6.50001L13.25 6.50001C13.25 8.29493 14.7051 9.75001 16.5 9.75001L16.5 7.25001ZM1.5 16.25L6 16.25L6 13.75L1.5 13.75L1.5 16.25ZM6.75 17L6.75 21.5L9.25 21.5L9.25 17L6.75 17ZM6 16.25C6.41421 16.25 6.75 16.5858 6.75 17H9.25C9.25 15.2051 7.79493 13.75 6 13.75V16.25Z"/>
					</svg>
					: <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
						<path d="M13 0.75C12.3096 0.750001 11.75 1.30965 11.75 2C11.75 2.69036 12.3096 3.25 13 3.25L13 0.75ZM17.5 1.99999L17.5 0.749992L17.5 0.749992L17.5 1.99999ZM18.25 8.5C18.25 9.19036 18.8096 9.75 19.5 9.75C20.1904 9.75 20.75 9.19036 20.75 8.5H18.25ZM8.5 20.75C9.19035 20.75 9.75 20.1904 9.75 19.5C9.75 18.8096 9.19036 18.25 8.5 18.25L8.5 20.75ZM4 19.5L4 18.25L4 18.25L4 19.5ZM2 17.5L0.75 17.5L0.75 17.5L2 17.5ZM3.25 13C3.25 12.3096 2.69036 11.75 2 11.75C1.30964 11.75 0.75 12.3096 0.75 13L3.25 13ZM13 3.25L17.5 3.24999L17.5 0.749992L13 0.75L13 3.25ZM18.25 3.99999V8.5H20.75V3.99999H18.25ZM17.5 3.24999C17.9142 3.24999 18.25 3.58578 18.25 3.99999H20.75C20.75 2.20507 19.2949 0.749992 17.5 0.749992V3.24999ZM8.5 18.25L4 18.25L4 20.75L8.5 20.75L8.5 18.25ZM3.25 17.5L3.25 13L0.75 13L0.75 17.5L3.25 17.5ZM4 18.25C3.58579 18.25 3.25 17.9142 3.25 17.5L0.75 17.5C0.75 19.2949 2.20508 20.75 4 20.75L4 18.25Z"/>
					</svg> }
				</button>
				<a href="mailto:alfie9@mail.ru" title="Напишите мне" className="Button">
					<svg viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.28 12.768C5.904 12.768 6.096 12.528 6.216 11.88C6.696 9.72 10.56 9.36 10.56 5.16C10.56 2.856 8.712 0.935999 5.52 0.935999C3.744 0.935999 2.28 1.68 1.32 2.712C1.152 2.904 0.984 3.168 0.984 3.456C0.984 3.624 1.032 3.792 1.2 3.96L1.752 4.512C1.968 4.728 2.184 4.824 2.424 4.824C2.616 4.824 2.808 4.752 3 4.584C3.624 3.984 4.368 3.696 5.352 3.696C6.648 3.696 7.608 4.632 7.608 5.76C7.608 8.688 3.6 8.616 3.6 11.928C3.6 12.456 3.936 12.768 4.344 12.768H5.28ZM3.168 16.2C3.168 17.184 3.888 18.12 5.064 18.12C6.12 18.12 6.84 17.184 6.84 16.2C6.84 15.36 6.12 14.424 5.064 14.424C3.888 14.424 3.168 15.36 3.168 16.2Z" />
				</svg>
				</a>
			</div>
		</Fragment>)
}

export default Player;


























// //  Основная рерсия без waiting и тд (РАБОТАЕТ)
// import React, { Fragment, useState, createRef, useEffect } from 'react';
// import classNames from 'classnames';

// const trackRef = createRef();
// const progressRef = createRef();
// const audioRef = createRef();
// const videoRef = createRef();
// const timeRef = createRef();

// // TODO: А по хорошему надо сделать проверки на существование видео и аудиофайла
// function Player({ 
// 	activeAudio, 
// 	activeVideo, 

// 	setIsPlaying, 
// 	isPlaying, 

// 	setLoop, 
// 	isLooped, 

// 	setFullscreen, 
// 	isFullscreen,

// 	setIsCan,
// 	isCan,

// 	setIsEnded,
// 	isEnded
// }) {
// 	const [fakeDuration, setFakeDuration] = useState(600);
// 	const [outlineLength, setOutlineLength] = useState(null);
// 	const [progressLength, setProgressLength] = useState(null);

// 	const resetTime = () => {
// 		console.log('resetTime')
// 		audioRef.current.currentTime = 0;
// 		videoRef.current.currentTime = 0;
// 	}

// 	const setDuration = duration => {
// 		resetTime()		// Здесь тоже произойдёт timeupdate
// 		setFakeDuration(duration);
// 		// setBarsLength();
// 	}

// 	const toTimeFormat = num => {
// 		return (+num >= 0 && +num <= 9) ? '0' + num : num;
// 	}

// 	const stopSound = () => {
// 		if (isPlaying) {
// 			audioRef.current.pause();
// 			setIsPlaying(false);
// 			// videoRef.current.pause();
// 		}
// 	}

// 	// const playSound = useCallback(() => {
// 	const playSound = () => {
// 		if (!isPlaying) {
// 			audioRef.current.play()
// 				.then(() => {
// 					setIsPlaying(true);
// 				})
// 			// videoRef.current.play();
// 		}
// 	}

// 	const playPauseSound = () => {
// 		if (isPlaying) {
// 			stopSound();
// 		} else {
// 			playSound();
// 		}
// 	}

// 	// const onEnd = () => {
// 	// 	resetTime();
// 	// 	setIsEnded(false);
// 	// 	setIsPlaying(false);
		
// 	// 	if (isLooped) {
// 	// 		console.log('Зациклено', isLooped)
// 	// 		playSound();
// 	// 	} else {
// 	// 		console.log('Не зациклено', isLooped)
// 	// 		stopSound();
// 	// 	}
// 	// }

// 	// const handleEnd = () => {
// 	// 	console.log('ENDED')
// 	// 	setIsEnded(true);
// 	// }

// 	const onPlay = () => {
// 		console.log('onPlay')
// 		let currentTime = audioRef.current.currentTime;
// 		let elapsedTime = fakeDuration - currentTime;

// 		let seconds = Math.floor(elapsedTime % 60);
// 		let minutes = Math.floor(elapsedTime / 60);
// 		timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;

// 		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 		trackRef.current.style.strokeDashoffset = progress;

// 		// if (currentTime >= fakeDuration) {
// 		if (currentTime >= fakeDuration || audioRef.current.ended) {
// 			// handleEnd()
// 			console.log('END')
// 		}
// 	}

// 	// TODO: Сбрасывать бар когда выбираю время, или делается ресет	(Оказалось сложновато, как вариант можно прятать бар, когда трек полностью загружен)
// 	// Ну или хранить loadedTime в стэйте, чего не очень хочется ибо это ререндеры
// 	// А может вообще вынести бары из стейта в глобальные переменные?
// 	const onProgress = (e) => {
// 		console.log('progress')
// 		// if (audioRef.current.readyState !== 0) {	// Без этого buffered почемуто выдаёт ошибку
// 		if (e.target.buffered.length > 0) {	// Без этого buffered почемуто выдаёт ошибку
// 		// if (audioRef.current.buffered.length > 0) {	// Без этого buffered почемуто выдаёт ошибку
// 			var loadedTime = e.target.buffered.end(0);
// 			console.log(loadedTime);
		
// 			let progress = progressLength - (loadedTime / fakeDuration) * progressLength;
// 			progressRef.current.style.strokeDashoffset = progress;
// 		}
// 	}

// 	const handleHotKeys = (e) => {
// 		e.preventDefault();
// 		// console.log(e.keyCode)
// 		switch (e.keyCode) {
// 			case 32:	// Space
// 				playPauseSound();
// 				break;
// 			case 70:	// F
// 				setFullscreen();
// 				break;
// 			case 76:	// L
// 				setLoop();
// 				break;
// 			case 49:	// 1
// 				setDuration(120);
// 				break;
// 			case 50:	// 2
// 				setDuration(300);
// 				break;
// 			case 51:	// 3
// 				setDuration(600);
// 				break;
// 			default:  return;
// 		}
// 	}

// 	// const checkCanPlay = () => {
// 	// 	console.log('Can Play');
// 	// 	if (isPlaying) {
// 	// 		// audioRef.current.play()
// 	// 		playSound();
// 	// 	}
// 	// 	// Также нужно проверять на isLooped, так как запускается даже если false
// 	// 	// setIsCan(true);
// 	// 	// if (isPlaying) playSound();	// TODO: Подумать как сделать так, чтобы по клику на weather не запускалось сразу  (Глазком глянуть на события playing и waiting, но думаю до этого не дойдёт)
// 	// }

// 	// const setWaiting = () => {
// 	// 	console.log('Waiting')
// 	// 	setIsCan(false);
// 	// }


// // 	// устанавливаю ширину bar-а изначально 
// // 	useEffect(() => {
// // 		let length = trackRef.current.getTotalLength()
// // 		setOutlineLength(length);
// // 		setProgressLength(length);
// // 		trackRef.current.style.strokeDasharray = length;
// // 		trackRef.current.style.strokeDashoffset = length;
// // 		progressRef.current.style.strokeDasharray = length;
// // 		progressRef.current.style.strokeDashoffset = length;
// // 	}, [setOutlineLength, setProgressLength])
	


// 	useEffect(() => {
// 		audioRef.current.load();
// 		videoRef.current.load();
// 		console.log('LOADED')
// 		// И вот тут как раз надо делать setIsCan(true)		Если он вообще понадобится, думаю playing ну и waiting -достаточно

// 		// Сбрасываю длину баров
// 		let length = trackRef.current.getTotalLength()
// 		progressRef.current.style.strokeDashoffset = length;
// 		progressRef.current.style.strokeDasharray = length;
// 		trackRef.current.style.strokeDashoffset = length;
// 		trackRef.current.style.strokeDasharray = length;
// 		// setOutlineLength(length);
// 		// setProgressLength(length);
// 	}, [activeAudio])

// 	// useEffect(() => {
// 	// 	if (isCan && isPlaying) {
// 	// 		playSound()
// 	// 	}
// 	// }, [isCan, isPlaying, playSound])

// 	// useEffect(() => {
// 	// 	if (isEnded) {
// 	// 		onEnd();
// 	// 	}
// 	// })

// 	const setWaiting = () => {
// 		console.log('WAITING')
// 	}

// 	const setReadyToPlay = () => {
// 		console.log('READY TO PLAY')
// 	}

// 	// Может тоже порефакторить
// 	useEffect(() => {
// 		// TODO: Когда происходит это событие, нужно блокировать кнопки выбора погоды, так как вылазиет ошибка. (Так как аудио проигрывается формально, хоть и waiting, но мы его нарушаем меняя url аудио)
// 		let ref = audioRef.current;
// 		ref.addEventListener('waiting', setWaiting);
// 		return () => ref.removeEventListener('waiting', setWaiting);
// 	})

// 	useEffect(() => {
// 		let ref = audioRef.current;
// 		ref.addEventListener('playing', setReadyToPlay);
// 		return () => ref.removeEventListener('playing', setReadyToPlay);
// 	})

// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('timeupdate', onPlay);
// 		return () => ref.removeEventListener('timeupdate', onPlay);
// 	})

// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('progress', onProgress);
// 		return () => ref.removeEventListener('progress', onProgress);
// 	})

// 	useEffect(() => {
// 		document.addEventListener('keydown', handleHotKeys);
// 		return () => document.removeEventListener('keydown', handleHotKeys);
// 	})



// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('error', (e) => {
// 			alert('Ошибка: ' + ref.error + ', ' + ref.error.message + ', ' + ref.error.code)
// 			alert(ref.error.code)
// 			ref.load();
// 		});
// 		return () => ref.removeEventListener('error', (e) => {
// 			alert('Ошибка: ' + ref.error + ', ' + ref.error.message + ', ' + ref.error.code)
// 			alert(ref.error.code)
// 			ref.load();
// 		});
// 	})


	

// 	return (
// 		<Fragment>
// 			<div className="App__video">
// 				<video ref={videoRef} preload="none" src={activeVideo} loop></video>
// 			</div>

// 			<div className="App__player">
// 				<div className="App__player-track">
// 					<button onClick={ playPauseSound } className="Button Button--active" title={ isPlaying ? 'Отстановить [Пробел]' : 'Проигрывать [Пробел]' }>
// 						{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
// 							<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
// 						</svg> 
// 						: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
// 						</svg>
// 					}
// 					</button>
// 					<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 					<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 					<svg className="progress-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle ref={progressRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 				</div>
// 				<audio ref={audioRef} preload="none" src={activeAudio}></audio>
// 				<h1 ref={timeRef} className="App__player-time">00:00</h1>
// 			</div>

// 			<div className="App__times">
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 15 }) } title="2 минуты [1]" name="15" onClick={() => setDuration(15)}>2 минуты</button>
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут [2]" name="300" onClick={() => setDuration(300)}>5 минут</button>
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут [3]" name="600" onClick={() => setDuration(600)}>10 минут</button>
// 			</div>

// 			<div className="App__controls">
// 				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить [L]">
// 					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
// 					<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
// 					C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
// 					c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
// 					c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
// 					c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
// 					c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
// 					C373.891,156.837,370.527,144.907,361.093,139.623z"/>
// 					<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
// 					c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
// 				</svg>
// 				</button>
// 				<button className="Button" title={ !isFullscreen ? "Во весь экран [F]" : "Выход из полноэкранного режима [F]" } onClick={setFullscreen}>
// 					{ isFullscreen ? <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M21 9.75C21.6904 9.75 22.25 9.19035 22.25 8.5C22.25 7.80964 21.6904 7.25 21 7.25L21 9.75ZM16.5 8.50001L16.5 9.75001L16.5 9.75001L16.5 8.50001ZM14.5 6.50001L15.75 6.50001L15.75 6.50001L14.5 6.50001ZM15.75 2C15.75 1.30964 15.1904 0.75 14.5 0.75C13.8096 0.75 13.25 1.30964 13.25 2L15.75 2ZM1.5 13.75C0.809646 13.75 0.250001 14.3097 0.25 15C0.249999 15.6904 0.809642 16.25 1.5 16.25L1.5 13.75ZM6 15L6 16.25H6V15ZM8 17L9.25 17V17H8ZM6.75 21.5C6.75 22.1904 7.30964 22.75 8 22.75C8.69036 22.75 9.25 22.1904 9.25 21.5L6.75 21.5ZM21 7.25L16.5 7.25001L16.5 9.75001L21 9.75L21 7.25ZM15.75 6.50001L15.75 2L13.25 2L13.25 6.50001L15.75 6.50001ZM16.5 7.25001C16.0858 7.25001 15.75 6.91422 15.75 6.50001L13.25 6.50001C13.25 8.29493 14.7051 9.75001 16.5 9.75001L16.5 7.25001ZM1.5 16.25L6 16.25L6 13.75L1.5 13.75L1.5 16.25ZM6.75 17L6.75 21.5L9.25 21.5L9.25 17L6.75 17ZM6 16.25C6.41421 16.25 6.75 16.5858 6.75 17H9.25C9.25 15.2051 7.79493 13.75 6 13.75V16.25Z"/>
// 					</svg>
// 					: <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M13 0.75C12.3096 0.750001 11.75 1.30965 11.75 2C11.75 2.69036 12.3096 3.25 13 3.25L13 0.75ZM17.5 1.99999L17.5 0.749992L17.5 0.749992L17.5 1.99999ZM18.25 8.5C18.25 9.19036 18.8096 9.75 19.5 9.75C20.1904 9.75 20.75 9.19036 20.75 8.5H18.25ZM8.5 20.75C9.19035 20.75 9.75 20.1904 9.75 19.5C9.75 18.8096 9.19036 18.25 8.5 18.25L8.5 20.75ZM4 19.5L4 18.25L4 18.25L4 19.5ZM2 17.5L0.75 17.5L0.75 17.5L2 17.5ZM3.25 13C3.25 12.3096 2.69036 11.75 2 11.75C1.30964 11.75 0.75 12.3096 0.75 13L3.25 13ZM13 3.25L17.5 3.24999L17.5 0.749992L13 0.75L13 3.25ZM18.25 3.99999V8.5H20.75V3.99999H18.25ZM17.5 3.24999C17.9142 3.24999 18.25 3.58578 18.25 3.99999H20.75C20.75 2.20507 19.2949 0.749992 17.5 0.749992V3.24999ZM8.5 18.25L4 18.25L4 20.75L8.5 20.75L8.5 18.25ZM3.25 17.5L3.25 13L0.75 13L0.75 17.5L3.25 17.5ZM4 18.25C3.58579 18.25 3.25 17.9142 3.25 17.5L0.75 17.5C0.75 19.2949 2.20508 20.75 4 20.75L4 18.25Z"/>
// 					</svg> }
// 				</button>
// 				<a href="mailto:alfie9@mail.ru" title="Напишите мне" className="Button">
// 					<svg viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
// 					<path d="M5.28 12.768C5.904 12.768 6.096 12.528 6.216 11.88C6.696 9.72 10.56 9.36 10.56 5.16C10.56 2.856 8.712 0.935999 5.52 0.935999C3.744 0.935999 2.28 1.68 1.32 2.712C1.152 2.904 0.984 3.168 0.984 3.456C0.984 3.624 1.032 3.792 1.2 3.96L1.752 4.512C1.968 4.728 2.184 4.824 2.424 4.824C2.616 4.824 2.808 4.752 3 4.584C3.624 3.984 4.368 3.696 5.352 3.696C6.648 3.696 7.608 4.632 7.608 5.76C7.608 8.688 3.6 8.616 3.6 11.928C3.6 12.456 3.936 12.768 4.344 12.768H5.28ZM3.168 16.2C3.168 17.184 3.888 18.12 5.064 18.12C6.12 18.12 6.84 17.184 6.84 16.2C6.84 15.36 6.12 14.424 5.064 14.424C3.888 14.424 3.168 15.36 3.168 16.2Z" />
// 				</svg>
// 				</a>
// 			</div>
// 		</Fragment>)
// }

// export default Player;








































// //  Основная рерсия без waiting и тд (РАБОТАЕТ)
// import React, { Fragment, useState, createRef, useEffect, useCallback } from 'react';
// import classNames from 'classnames';

// const progressRef = createRef();
// const trackRef = createRef();
// const audioRef = createRef();
// const videoRef = createRef();
// const timeRef = createRef();

// // TODO: А по хорошему надо сделать проверки на существование видео и аудиофайла
// function Player({ 
// 	activeAudio, 
// 	activeVideo, 

// 	setIsPlaying, 
// 	isPlaying, 

// 	setLoop, 
// 	isLooped, 

// 	setFullscreen, 
// 	isFullscreen,

// 	setIsCan,
// 	isCan,

// 	setIsEnded,
// 	isEnded
// }) {
// 	const [fakeDuration, setFakeDuration] = useState(600);
// 	const [outlineLength, setOutlineLength] = useState(null);
// 	const [progressLength, setProgressLength] = useState(null);

// 	const resetTime = () => {
// 		audioRef.current.currentTime = 0;
// 		videoRef.current.currentTime = 0;
// 	}

// 	const setDuration = duration => {
// 		// audioRef.current.load()
// 		resetTime()		// Здесь тоже произойдёт timeupdate
// 		setFakeDuration(duration);
// 		// setBarsLength();
// 	}

// 	const toTimeFormat = num => {
// 		return (+num >= 0 && +num <= 9) ? '0' + num : num;
// 	}

// 	const stopSound = () => {
// 		setIsPlaying(false);
// 		audioRef.current.pause();
// 		// videoRef.current.pause();
// 	}

// 	// const playSound = useCallback(() => {
// 	const playSound = () => {
// 		// if (isCan) {
// 			setIsPlaying(true);
// 			audioRef.current.play();
// 			// videoRef.current.play();
// 		// }
// 	// }, [isCan, setIsPlaying]);
// 	}

// 	const playPauseSound = () => {
// 		if (isPlaying) {
// 			stopSound();
// 		} else {
// 			playSound();
// 		}
// 	}

// 	// const onEnd = () => {
// 	// 	resetTime();
// 	// 	setIsEnded(false);
// 	// 	setIsPlaying(false);
		
// 	// 	if (isLooped) {
// 	// 		console.log('Зациклено', isLooped)
// 	// 		playSound();
// 	// 	} else {
// 	// 		console.log('Не зациклено', isLooped)
// 	// 		stopSound();
// 	// 	}
// 	// }

// 	// const handleEnd = () => {
// 	// 	console.log('ENDED')
// 	// 	setIsEnded(true);
// 	// }

// 	const onPlay = () => {
// 		let currentTime = audioRef.current.currentTime;
// 		let elapsedTime = fakeDuration - currentTime;

// 		let seconds = Math.floor(elapsedTime % 60);
// 		let minutes = Math.floor(elapsedTime / 60);
// 		timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;

// 		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 		trackRef.current.style.strokeDashoffset = progress;

// 		// if (currentTime >= fakeDuration) {
// 		if (currentTime >= fakeDuration || audioRef.current.ended) {
// 			// handleEnd()
// 			console.log('END')
// 		}
// 	}

// 	// TODO: Сбрасывать бар когда выбираю время, или делается ресет	(Оказалось сложновато, как вариант можно прятать бар, когда трек полностью загружен)
// 	// Ну или хранить loadedTime в стэйте, чего не очень хочется ибо это ререндеры
// 	// А может вообще вынести бары из стейта в глобальные переменные?
// 	const onProgress = (e) => {
// 		console.log('progress')
// 		if (audioRef.current.readyState !== 0) {	// Без этого buffered почемуто выдаёт ошибку
// 			var loadedTime = e.target.buffered.end(0);
// 			console.log(loadedTime);
		
// 			let progress = progressLength - (loadedTime / fakeDuration) * progressLength;
// 			progressRef.current.style.strokeDashoffset = progress;
// 		}
// 	}

// 	const handleHotKeys = (e) => {
// 		e.preventDefault();
// 		// console.log(e.keyCode)
// 		switch (e.keyCode) {
// 			case 32:	// Space
// 				playPauseSound();
// 				break;
// 			case 70:	// F
// 				setFullscreen();
// 				break;
// 			case 76:	// L
// 				setLoop();
// 				break;
// 			case 49:	// 1
// 				setDuration(120);
// 				break;
// 			case 50:	// 2
// 				setDuration(300);
// 				break;
// 			case 51:	// 3
// 				setDuration(600);
// 				break;
// 			default:  return;
// 		}
// 	}

// 	const checkCanPlay = () => {
// 		console.log('Can Play');
// 		if (isPlaying) {
// 			// audioRef.current.play()
// 			playSound();
// 		}
// 		// Также нужно проверять на isLooped, так как запускается даже если false
// 		// setIsCan(true);
// 		// if (isPlaying) playSound();	// TODO: Подумать как сделать так, чтобы по клику на weather не запускалось сразу  (Глазком глянуть на события playing и waiting, но думаю до этого не дойдёт)
// 	}

// 	// const checkCanPlay = () => {
// 	// 	console.log('Can Play');
// 	// 	// Также нужно проверять на isLooped, так как запускается даже если false
// 	// 	setIsCan(true);
// 	// 	// if (isPlaying) playSound();	// TODO: Подумать как сделать так, чтобы по клику на weather не запускалось сразу  (Глазком глянуть на события playing и waiting, но думаю до этого не дойдёт)
// 	// }

// 	// const setWaiting = () => {
// 	// 	console.log('Waiting')
// 	// 	setIsCan(false);
// 	// }



// 	// useEffect(() => {
// 	// 	audioRef.current.load();
// 	// 	console.log('LOADED')
// 	// }, [activeAudio])

// 	// устанавливаю ширину bar-а изначально 
// 	useEffect(() => {
// 		let length = trackRef.current.getTotalLength()
// 		setOutlineLength(length);
// 		setProgressLength(length);
// 		trackRef.current.style.strokeDasharray = length;
// 		trackRef.current.style.strokeDashoffset = length;
// 		progressRef.current.style.strokeDasharray = length;
// 		progressRef.current.style.strokeDashoffset = length;
// 	}, [setOutlineLength, setProgressLength])



// 	// useEffect(() => {
// 	// 	if (isCan && isPlaying) {
// 	// 		playSound()
// 	// 	}
// 	// }, [isCan, isPlaying, playSound])

// 	// useEffect(() => {
// 	// 	if (isEnded) {
// 	// 		onEnd();
// 	// 	}
// 	// })

// 	// Может тоже порефакторить
// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('timeupdate', onPlay);
// 		return () => ref.removeEventListener('timeupdate', onPlay);
// 	})

// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('progress', onProgress);
// 		return () => ref.removeEventListener('progress', onProgress);
// 	})

// 	useEffect(() => {
// 		document.addEventListener('keydown', handleHotKeys);
// 		return () => document.removeEventListener('keydown', handleHotKeys);
// 	})

// 	// По возможности избавиться. Почемуто Can Play в консоль выводится с экспоненциальным ростом. Так же возникли баги с клавишами из за этого скорее всего, много ререндеров
// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('canplay', checkCanPlay);
// 		return () => ref.removeEventListener('canplay', checkCanPlay);
// 	})

// 	useEffect(() => {
// 		const ref = audioRef.current;
// 		ref.addEventListener('error', () => {
// 			alert(ref.error.message + ', ' + ref.error.code)
// 			ref.load();
// 		});
// 		return () => ref.removeEventListener('error', () => {
// 			alert(ref.error.message + ', ' + ref.error.code)
// 			ref.load();
// 		});
// 	})

// 	// useEffect(() => {
// 	// 	const ref = audioRef.current;
// 	// 	ref.addEventListener('waiting', setWaiting);
// 	// 	return () => ref.removeEventListener('waiting', setWaiting);
// 	// })

	

// 	return (
// 		<Fragment>
// 			<div className="App__video">
// 				<video ref={videoRef} src={activeVideo} loop></video>
// 			</div>

// 			<div className="App__player">
// 				<div className="App__player-track">
// 					<button onClick={ playPauseSound } className="Button Button--active" title={ isPlaying ? 'Отстановить [Пробел]' : 'Проигрывать [Пробел]' }>
// 						{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
// 							<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
// 						</svg> 
// 						: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
// 						</svg>
// 					}
// 					</button>
// 					<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 					<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 					<svg className="progress-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle ref={progressRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 				</div>
// 				<audio ref={audioRef} src={activeAudio}></audio>
// 				<h1 ref={timeRef} className="App__player-time">00:00</h1>
// 			</div>

// 			<div className="App__times">
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 120 }) } title="2 минуты [1]" name="120" onClick={() => setDuration(120)}>2 минуты</button>
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут [2]" name="300" onClick={() => setDuration(300)}>5 минут</button>
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут [3]" name="600" onClick={() => setDuration(600)}>10 минут</button>
// 			</div>

// 			<div className="App__controls">
// 				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить [L]">
// 					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
// 					<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
// 					C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
// 					c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
// 					c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
// 					c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
// 					c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
// 					C373.891,156.837,370.527,144.907,361.093,139.623z"/>
// 					<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
// 					c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
// 				</svg>
// 				</button>
// 				<button className="Button" title={ !isFullscreen ? "Во весь экран [F]" : "Выход из полноэкранного режима [F]" } onClick={setFullscreen}>
// 					{ isFullscreen ? <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M21 9.75C21.6904 9.75 22.25 9.19035 22.25 8.5C22.25 7.80964 21.6904 7.25 21 7.25L21 9.75ZM16.5 8.50001L16.5 9.75001L16.5 9.75001L16.5 8.50001ZM14.5 6.50001L15.75 6.50001L15.75 6.50001L14.5 6.50001ZM15.75 2C15.75 1.30964 15.1904 0.75 14.5 0.75C13.8096 0.75 13.25 1.30964 13.25 2L15.75 2ZM1.5 13.75C0.809646 13.75 0.250001 14.3097 0.25 15C0.249999 15.6904 0.809642 16.25 1.5 16.25L1.5 13.75ZM6 15L6 16.25H6V15ZM8 17L9.25 17V17H8ZM6.75 21.5C6.75 22.1904 7.30964 22.75 8 22.75C8.69036 22.75 9.25 22.1904 9.25 21.5L6.75 21.5ZM21 7.25L16.5 7.25001L16.5 9.75001L21 9.75L21 7.25ZM15.75 6.50001L15.75 2L13.25 2L13.25 6.50001L15.75 6.50001ZM16.5 7.25001C16.0858 7.25001 15.75 6.91422 15.75 6.50001L13.25 6.50001C13.25 8.29493 14.7051 9.75001 16.5 9.75001L16.5 7.25001ZM1.5 16.25L6 16.25L6 13.75L1.5 13.75L1.5 16.25ZM6.75 17L6.75 21.5L9.25 21.5L9.25 17L6.75 17ZM6 16.25C6.41421 16.25 6.75 16.5858 6.75 17H9.25C9.25 15.2051 7.79493 13.75 6 13.75V16.25Z"/>
// 					</svg>
// 					: <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M13 0.75C12.3096 0.750001 11.75 1.30965 11.75 2C11.75 2.69036 12.3096 3.25 13 3.25L13 0.75ZM17.5 1.99999L17.5 0.749992L17.5 0.749992L17.5 1.99999ZM18.25 8.5C18.25 9.19036 18.8096 9.75 19.5 9.75C20.1904 9.75 20.75 9.19036 20.75 8.5H18.25ZM8.5 20.75C9.19035 20.75 9.75 20.1904 9.75 19.5C9.75 18.8096 9.19036 18.25 8.5 18.25L8.5 20.75ZM4 19.5L4 18.25L4 18.25L4 19.5ZM2 17.5L0.75 17.5L0.75 17.5L2 17.5ZM3.25 13C3.25 12.3096 2.69036 11.75 2 11.75C1.30964 11.75 0.75 12.3096 0.75 13L3.25 13ZM13 3.25L17.5 3.24999L17.5 0.749992L13 0.75L13 3.25ZM18.25 3.99999V8.5H20.75V3.99999H18.25ZM17.5 3.24999C17.9142 3.24999 18.25 3.58578 18.25 3.99999H20.75C20.75 2.20507 19.2949 0.749992 17.5 0.749992V3.24999ZM8.5 18.25L4 18.25L4 20.75L8.5 20.75L8.5 18.25ZM3.25 17.5L3.25 13L0.75 13L0.75 17.5L3.25 17.5ZM4 18.25C3.58579 18.25 3.25 17.9142 3.25 17.5L0.75 17.5C0.75 19.2949 2.20508 20.75 4 20.75L4 18.25Z"/>
// 					</svg> }
// 				</button>
// 				<a href="mailto:alfie9@mail.ru" title="Напишите мне" className="Button">
// 					<svg viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
// 					<path d="M5.28 12.768C5.904 12.768 6.096 12.528 6.216 11.88C6.696 9.72 10.56 9.36 10.56 5.16C10.56 2.856 8.712 0.935999 5.52 0.935999C3.744 0.935999 2.28 1.68 1.32 2.712C1.152 2.904 0.984 3.168 0.984 3.456C0.984 3.624 1.032 3.792 1.2 3.96L1.752 4.512C1.968 4.728 2.184 4.824 2.424 4.824C2.616 4.824 2.808 4.752 3 4.584C3.624 3.984 4.368 3.696 5.352 3.696C6.648 3.696 7.608 4.632 7.608 5.76C7.608 8.688 3.6 8.616 3.6 11.928C3.6 12.456 3.936 12.768 4.344 12.768H5.28ZM3.168 16.2C3.168 17.184 3.888 18.12 5.064 18.12C6.12 18.12 6.84 17.184 6.84 16.2C6.84 15.36 6.12 14.424 5.064 14.424C3.888 14.424 3.168 15.36 3.168 16.2Z" />
// 				</svg>
// 				</a>
// 			</div>
// 		</Fragment>)
// }

// export default Player;


















// //  Основная рерсия без waiting и тд (РАБОТАЕТ)
// import React, { Fragment, useState, createRef, useEffect } from 'react';
// import classNames from 'classnames';

// const progressRef = createRef();
// const trackRef = createRef();
// const audioRef = createRef();
// const videoRef = createRef();
// const timeRef = createRef();

// // TODO: А по хорошему надо сделать проверки на существование видео и аудиофайла
// function Player({ setIsPlaying, isPlaying, isLooped, setLoop, activeAudio, activeVideo, goFull, isFullscreen }) {
// 	const [fakeDuration, setFakeDuration] = useState(600);
// 	const [isEnded, setIsEnded] = useState(false);		// Возможно стоит вынести в родителя
// 	// const [isCanPlay, setIsCanPlay] = useState(false);		// Возможно стоит вынести в родителя
// 	const [outlineLength, setOutlineLength] = useState(null);
// 	const [progressLength, setProgressLength] = useState(null);
// 	// console.log(isLooped)

// 	const resetTime = () => {
// 		audioRef.current.currentTime = 0;
// 		videoRef.current.currentTime = 0;
// 	}

// 	const setDuration = duration => {
// 		// audioRef.current.load()
// 		resetTime()		// Здесь тоже произойдёт timeupdate
// 		setFakeDuration(duration);
// 		// setBarsLength();
// 	}

// 	const toTimeFormat = num => {
// 		return (+num >= 0 && +num <= 9) ? '0' + num : num;
// 	}

// 	const stopSound = () => {
// 		setIsPlaying(false);
// 		audioRef.current.pause();
// 		videoRef.current.pause();
// 	}

// 	const playSound = () => {
// 		setIsPlaying(true);
// 		// if (audioRef.current.readyState !== 0) {
// 			// audioRef.current.load();
// 			audioRef.current.play();
// 			videoRef.current.play();
// 		// }
// 	}

// 	const playPauseSound = () => {
// 		if (isPlaying) {
// 			stopSound();
// 		} else {
// 			playSound();
// 		}
// 	}

// 	const onEnd = () => {
// 		resetTime();
// 		setIsEnded(false);
// 		setIsPlaying(false);
		
// 		if (isLooped) {
// 			console.log('Зациклено', isLooped)
// 			playSound();
// 		} else {
// 			console.log('Не зациклено', isLooped)
// 			stopSound();
// 		}
// 	}

// 	const handleEnd = () => {
// 		console.log('ENDED')
// 		setIsEnded(true);
// 	}

// 	const onPlay = () => {
// 		let currentTime = audioRef.current.currentTime;
// 		let elapsedTime = fakeDuration - currentTime;

// 		let seconds = Math.floor(elapsedTime % 60);
// 		let minutes = Math.floor(elapsedTime / 60);
// 		timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;

// 		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 		trackRef.current.style.strokeDashoffset = progress;

// 		// if (currentTime >= fakeDuration) {
// 		if (currentTime >= fakeDuration || audioRef.current.ended) {
// 			handleEnd()
// 		}
// 	}

// 	// TODO: Сбрасывать бар когда выбираю время, или делается ресет	(Оказалось сложновато, как вариант можно прятать бар, когда трек полностью загружен)
// 	// Ну или хранить loadedTime в стэйте, чего не очень хочется ибо это ререндеры
// 	// А может вообще вынести бары из стейта в глобальные переменные?
// 	const onProgress = (e) => {
// 		console.log('progress')
// 		if (audioRef.current.readyState !== 0) {	// Без этого buffered почемуто выдаёт ошибку
// 			var loadedTime = e.target.buffered.end(0);
// 			console.log(loadedTime);
		
// 			let progress = progressLength - (loadedTime / fakeDuration) * progressLength;
// 			progressRef.current.style.strokeDashoffset = progress;
// 		}
// 	}

// 	const handleHotKeys = (e) => {
// 		e.preventDefault();
// 		// console.log(e.keyCode)
// 		switch (e.keyCode) {
// 			case 32:	// Space
// 				playPauseSound();
// 				break;
// 			case 70:	// F
// 				goFull();
// 				break;
// 			case 76:	// L
// 				setLoop();
// 				break;
// 			case 49:	// 1
// 				setDuration(120);
// 				break;
// 			case 50:	// 2
// 				setDuration(300);
// 				break;
// 			case 51:	// 3
// 				setDuration(600);
// 				break;
// 			default:  return;
// 		}
// 	}

// 	const checkCanPlay = () => {
// 		console.log('Can Play');
// 		// Также нужно проверять на isLooped, так как запускается даже если false
// 		if (isPlaying) playSound();	// TODO: Подумать как сделать так, чтобы по клику на weather не запускалось сразу  (Глазком глянуть на события playing и waiting, но думаю до этого не дойдёт)
// 	}

// 	// устанавливаю ширину bar-а изначально 
// 	useEffect(() => {
// 		let length = trackRef.current.getTotalLength()
// 		setOutlineLength(length);
// 		setProgressLength(length);
// 		trackRef.current.style.strokeDasharray = length;
// 		trackRef.current.style.strokeDashoffset = length;
// 		progressRef.current.style.strokeDasharray = length;
// 		progressRef.current.style.strokeDashoffset = length;
// 	}, [setOutlineLength, setProgressLength])

// 	useEffect(() => {
// 		if (isEnded) {
// 			onEnd();
// 		}
// 	})

// 	// Может тоже порефакторить
// 	useEffect(() => {
// 		audioRef.current.addEventListener('timeupdate', onPlay);
// 		return () => audioRef.current.removeEventListener('timeupdate', onPlay);
// 	})

// 	useEffect(() => {
// 		audioRef.current.addEventListener('progress', onProgress);
// 		return () => audioRef.current.removeEventListener('progress', onProgress);
// 	})

// 	useEffect(() => {
// 		document.addEventListener('keydown', handleHotKeys);
// 		return () => document.removeEventListener('keydown', handleHotKeys);
// 	})

// 	// По возможности избавиться. Почемуто Can Play в консоль выводится с экспоненциальным ростом. Так же возникли баги с клавишами из за этого скорее всего, много ререндеров
// 	useEffect(() => {
// 		audioRef.current.addEventListener('canplay', checkCanPlay);
// 		return () => audioRef.current.removeEventListener('canplay', checkCanPlay);
// 	})

	

	

// 	return (
// 		<Fragment>
// 			<div className="App__video">
// 				<video ref={videoRef} src={activeVideo} loop></video>
// 			</div>

// 			<div className="App__player">
// 				<div className="App__player-track">
// 					<button onClick={ playPauseSound } className="Button Button--active" title={ isPlaying ? 'Отстановить [Пробел]' : 'Проигрывать [Пробел]' }>
// 						{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
// 							<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
// 						</svg> 
// 						: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
// 							<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
// 						</svg>
// 					}
// 					</button>
// 					<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 					<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 					<svg className="progress-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<circle ref={progressRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 					</svg>
// 				</div>
// 				<audio ref={audioRef} src={activeAudio}></audio>
// 				<h1 ref={timeRef} className="App__player-time">00:00</h1>
// 			</div>

// 			<div className="App__times">
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 120 }) } title="2 минуты [1]" name="120" onClick={() => setDuration(120)}>2 минуты</button>
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут [2]" name="300" onClick={() => setDuration(300)}>5 минут</button>
// 				<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут [3]" name="600" onClick={() => setDuration(600)}>10 минут</button>
// 			</div>

// 			<div className="App__controls">
// 				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить [L]">
// 					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
// 					<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
// 					C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
// 					c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
// 					c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
// 					c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
// 					c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
// 					C373.891,156.837,370.527,144.907,361.093,139.623z"/>
// 					<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
// 					c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
// 				</svg>
// 				</button>
// 				<button className="Button" title={ !isFullscreen ? "Во весь экран [F]" : "Выход из полноэкранного режима [F]" } onClick={goFull}>
// 					{ isFullscreen ? <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M21 9.75C21.6904 9.75 22.25 9.19035 22.25 8.5C22.25 7.80964 21.6904 7.25 21 7.25L21 9.75ZM16.5 8.50001L16.5 9.75001L16.5 9.75001L16.5 8.50001ZM14.5 6.50001L15.75 6.50001L15.75 6.50001L14.5 6.50001ZM15.75 2C15.75 1.30964 15.1904 0.75 14.5 0.75C13.8096 0.75 13.25 1.30964 13.25 2L15.75 2ZM1.5 13.75C0.809646 13.75 0.250001 14.3097 0.25 15C0.249999 15.6904 0.809642 16.25 1.5 16.25L1.5 13.75ZM6 15L6 16.25H6V15ZM8 17L9.25 17V17H8ZM6.75 21.5C6.75 22.1904 7.30964 22.75 8 22.75C8.69036 22.75 9.25 22.1904 9.25 21.5L6.75 21.5ZM21 7.25L16.5 7.25001L16.5 9.75001L21 9.75L21 7.25ZM15.75 6.50001L15.75 2L13.25 2L13.25 6.50001L15.75 6.50001ZM16.5 7.25001C16.0858 7.25001 15.75 6.91422 15.75 6.50001L13.25 6.50001C13.25 8.29493 14.7051 9.75001 16.5 9.75001L16.5 7.25001ZM1.5 16.25L6 16.25L6 13.75L1.5 13.75L1.5 16.25ZM6.75 17L6.75 21.5L9.25 21.5L9.25 17L6.75 17ZM6 16.25C6.41421 16.25 6.75 16.5858 6.75 17H9.25C9.25 15.2051 7.79493 13.75 6 13.75V16.25Z"/>
// 					</svg>
// 					: <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M13 0.75C12.3096 0.750001 11.75 1.30965 11.75 2C11.75 2.69036 12.3096 3.25 13 3.25L13 0.75ZM17.5 1.99999L17.5 0.749992L17.5 0.749992L17.5 1.99999ZM18.25 8.5C18.25 9.19036 18.8096 9.75 19.5 9.75C20.1904 9.75 20.75 9.19036 20.75 8.5H18.25ZM8.5 20.75C9.19035 20.75 9.75 20.1904 9.75 19.5C9.75 18.8096 9.19036 18.25 8.5 18.25L8.5 20.75ZM4 19.5L4 18.25L4 18.25L4 19.5ZM2 17.5L0.75 17.5L0.75 17.5L2 17.5ZM3.25 13C3.25 12.3096 2.69036 11.75 2 11.75C1.30964 11.75 0.75 12.3096 0.75 13L3.25 13ZM13 3.25L17.5 3.24999L17.5 0.749992L13 0.75L13 3.25ZM18.25 3.99999V8.5H20.75V3.99999H18.25ZM17.5 3.24999C17.9142 3.24999 18.25 3.58578 18.25 3.99999H20.75C20.75 2.20507 19.2949 0.749992 17.5 0.749992V3.24999ZM8.5 18.25L4 18.25L4 20.75L8.5 20.75L8.5 18.25ZM3.25 17.5L3.25 13L0.75 13L0.75 17.5L3.25 17.5ZM4 18.25C3.58579 18.25 3.25 17.9142 3.25 17.5L0.75 17.5C0.75 19.2949 2.20508 20.75 4 20.75L4 18.25Z"/>
// 					</svg> }
// 				</button>
// 				<a href="mailto:alfie9@mail.ru" title="Напишите мне" className="Button">
// 					<svg viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
// 					<path d="M5.28 12.768C5.904 12.768 6.096 12.528 6.216 11.88C6.696 9.72 10.56 9.36 10.56 5.16C10.56 2.856 8.712 0.935999 5.52 0.935999C3.744 0.935999 2.28 1.68 1.32 2.712C1.152 2.904 0.984 3.168 0.984 3.456C0.984 3.624 1.032 3.792 1.2 3.96L1.752 4.512C1.968 4.728 2.184 4.824 2.424 4.824C2.616 4.824 2.808 4.752 3 4.584C3.624 3.984 4.368 3.696 5.352 3.696C6.648 3.696 7.608 4.632 7.608 5.76C7.608 8.688 3.6 8.616 3.6 11.928C3.6 12.456 3.936 12.768 4.344 12.768H5.28ZM3.168 16.2C3.168 17.184 3.888 18.12 5.064 18.12C6.12 18.12 6.84 17.184 6.84 16.2C6.84 15.36 6.12 14.424 5.064 14.424C3.888 14.424 3.168 15.36 3.168 16.2Z" />
// 				</svg>
// 				</a>
// 			</div>
// 		</Fragment>)
// }

// export default Player;