import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import './App.sass';

// TODO: Сделать приложение PWA

// TODO: Получать объекты с сервера и выводить циклом кнопки
import rainVideo from './assets/video/rain.mp4';
import rainAudio from './assets/sounds/rain.mp3';
import beachVideo from './assets/video/beach.mp4';
import beachAudio from './assets/sounds/beach.mp3';

function App() {
	// TODO: Подключить redux и хранить основные данные в сторе (Например текущее время, когда кликаем на паузу) - хотя нужно ли под вопросом
	const [activeAudio, setActiveAudio] = useState(rainAudio);
	const [activeVideo, setActiveVideo] = useState(rainVideo);
	const [activeWeather, setActiveWeather] = useState('rain');
	const [isPlaying, setIsPlaying] = useState(false);
	const [fakeDuration, setFakeDuration] = useState(600);
	const [outlineLength, setOutlineLength] = useState(null);
	const [currentSeconds, setCurrentSeconds] = useState(0);
	const [currentMinutes, setCurrentMinutes] = useState(0);

	const audioRef = useRef();
	const videoRef = useRef();
	const trackRef = useRef();

	const toTimeFormat = num => {
		return (+num >= 0 && +num <= 9) ? '0' + num : num;
	}

	const playSound = () => {
		if (isPlaying) {
			stopSound();
		} else {
			audioRef.current.play();
			videoRef.current.play();
			setIsPlaying(true);
		}
	}

	const stopSound = () => {
		audioRef.current.pause();
		videoRef.current.pause();
		setIsPlaying(false);
	}

	const resetSound = useCallback(() => {
		audioRef.current.currentTime = 0;
		videoRef.current.currentTime = 0;
		stopSound();
	}, [])


	const setWeather = (audio, video, weather) => {
		if (activeWeather === weather) return;
		setIsPlaying(false);
		setActiveWeather(weather)
		setActiveAudio(audio);
		setActiveVideo(video);
	}

	const setDuration = e => {
		audioRef.current.currentTime = 0;	// лучше это вынести в state
		setFakeDuration(+e.target.name);
	}



	const onPlay = useCallback(() => {
		let currentTime = audioRef.current.currentTime;
			
		let elapsedTime = fakeDuration - currentTime;
		setCurrentSeconds(Math.floor(elapsedTime % 60));
		setCurrentMinutes(Math.floor(elapsedTime / 60));

		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
		trackRef.current.style.strokeDashoffset = progress;

		if (currentTime >= fakeDuration) {
			// TODO: Останавливаем воспроизведение (или след аудио или repeat)
			resetSound()
		}
	}, [trackRef, fakeDuration, outlineLength, resetSound])

	useEffect(() => {
		let length = trackRef.current.getTotalLength()
		setOutlineLength(length);
		trackRef.current.style.strokeDasharray = length;
		trackRef.current.style.strokeDashoffset = length;
	}, [setOutlineLength])

	useEffect(() => {
		audioRef.current.addEventListener('timeupdate', onPlay);
	}, [onPlay, audioRef])





	
	
	return (
		<div className="App">
			<div className="App__video">
				<video ref={videoRef} src={activeVideo} loop></video>
			</div>

			<div className="App__times">
				<button className={ classNames('Button', { 'Button--active': fakeDuration === 120 }) } name="120" title="2 минуты" onClick={setDuration}>2 минуты</button>
				<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут" name="300" onClick={setDuration}>5 минут</button>
				<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут" name="600" onClick={setDuration}>10 минут</button>
			</div>

			<div className="App__player">
				<div className="App__player-track">
					<button onClick={ playSound } className="Button Button--active" title={ isPlaying ? 'Отстановить' : 'Проигрывать' }>
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
						<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
					</svg>
					<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
					</svg>
				</div>
				<audio ref={audioRef} src={activeAudio}></audio>
				<h1 className="App__player-time">{ toTimeFormat(currentMinutes) }:{ toTimeFormat(currentSeconds) }</h1>
			</div>

			<div className="App__controls">
				<button className="Button Button--active" title="Зациклить">
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
				<button className="Button" title="Следующий">
					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
						<path d="M15.5001 8.13397C16.1667 8.51887 16.1667 9.48112 15.5001 9.86602L2.00006 17.6602C1.33339 18.0451 0.500061 17.564 0.500061 16.7942L0.500062 1.20576C0.500062 0.43596 1.3334 -0.0451642 2.00006 0.339736L15.5001 8.13397Z"/>
						<path d="M17.9167 1.89582C17.9167 1.263 17.4037 0.749991 16.7709 0.749991C16.1381 0.749991 15.6251 1.263 15.6251 1.89582V16.1042C15.6251 16.737 16.1381 17.25 16.7709 17.25C17.4037 17.25 17.9167 16.737 17.9167 16.1042V1.89582Z"/>
					</svg>
				</button>
				<button className="Button" title="Предыдущий">
					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
					<path d="M2.41667 8.13398C1.75 8.51888 1.75 9.48113 2.41667 9.86603L15.9167 17.6603C16.5833 18.0452 17.4167 17.564 17.4167 16.7942V1.20577C17.4167 0.435972 16.5833 -0.0451528 15.9167 0.339747L2.41667 8.13398Z"/>
					<path d="M0 1.89584C0 1.26301 0.513007 0.750002 1.14583 0.750002C1.77866 0.750002 2.29167 1.26301 2.29167 1.89584V16.1042C2.29167 16.737 1.77866 17.25 1.14583 17.25C0.513007 17.25 0 16.737 0 16.1042V1.89584Z"/>
				</svg>		
				</button>
			</div>

			<div className="App__weather">
				{/* TODO: Получать их с сервера и выводить циклом */}
				<button className={ classNames('Button', { 'Button--active': activeWeather === 'rain' }) } onClick={() => setWeather(rainAudio, rainVideo, 'rain')}>
					<svg className="Button__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M16.6529 18.7879C16.9836 18.7879 17.3026 18.6068 17.4633 18.292L18.0823 17.0799C18.3106 16.6327 18.1332 16.0852 17.686 15.8568C17.2391 15.6285 16.6914 15.8059 16.4629 16.253L15.844 17.4651C15.6157 17.9123 15.793 18.4599 16.2402 18.6882C16.3726 18.7559 16.5139 18.7879 16.6529 18.7879Z"/>
						<path d="M12.011 19.9999C12.3417 19.9999 12.6606 19.8189 12.8213 19.5041L13.4402 18.292C13.6686 17.8448 13.4911 17.2973 13.044 17.0689C12.5969 16.8406 12.0493 17.018 11.8209 17.4651L11.202 18.6772C10.9736 19.1244 11.1511 19.6719 11.5982 19.9003C11.7307 19.9679 11.8718 19.9999 12.011 19.9999Z"/>
						<path d="M3.75969 17.069C3.31273 16.8407 2.76504 17.018 2.53661 17.4651L1.91765 18.6772C1.68929 19.1244 1.86668 19.672 2.31389 19.9004C2.44631 19.968 2.58746 20.0001 2.72661 20.0001C3.05727 20.0001 3.37624 19.8189 3.53697 19.5042L4.15593 18.2921C4.38429 17.8448 4.2069 17.2973 3.75969 17.069Z"/>
						<path d="M7.36877 18.7879C7.69943 18.7879 8.0184 18.6068 8.17912 18.292L8.79809 17.0799C9.02645 16.6327 8.84906 16.0852 8.40185 15.8568C7.95482 15.6285 7.40719 15.8059 7.17877 16.253L6.55981 17.4651C6.33151 17.9123 6.50884 18.4599 6.95605 18.6882C7.08847 18.7559 7.22962 18.7879 7.36877 18.7879Z"/>
						<path d="M14.8492 3.6339H14.7482C13.8893 1.46271 11.78 0 9.39477 0C6.3082 0 3.7812 2.44124 3.6432 5.49436C1.58699 5.7866 0.000946045 7.55876 0.000946045 9.69443C0.000946045 12.0337 1.90401 13.9368 4.24332 13.9368H14.8492C17.6898 13.9368 20.0007 11.6259 20.0007 8.78535C20.0007 5.94484 17.6898 3.6339 14.8492 3.6339Z"/>
					</svg>
					Дождь
				</button>
				<button className="Button">
					<svg className="Button__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M10 15.1515C12.8407 15.1515 15.1518 12.8405 15.1518 10.0001C15.1518 7.15945 12.8407 4.84848 10 4.84848C7.15957 4.84848 4.84872 7.15945 4.84872 10.0001C4.84872 12.8405 7.15957 15.1515 10 15.1515Z"/>
						<path d="M10 3.0303C10.502 3.0303 10.9091 2.62327 10.9091 2.12121V0.909091C10.9091 0.40703 10.502 0 10 0C9.49788 0 9.09091 0.40703 9.09091 0.909091V2.12121C9.09091 2.62327 9.49788 3.0303 10 3.0303Z"/>
						<path d="M10 20C10.502 20 10.9091 19.593 10.9091 19.0909V17.8788C10.9091 17.3767 10.502 16.9697 10 16.9697C9.49788 16.9697 9.09091 17.3767 9.09091 17.8788V19.0909C9.09091 19.593 9.49788 20 10 20Z"/>
						<path d="M16.9697 10C16.9697 10.5021 17.3768 10.9091 17.8788 10.9091H19.0909C19.5929 10.9091 20 10.5021 20 10C20 9.49794 19.5929 9.09091 19.0909 9.09091H17.8788C17.3768 9.09091 16.9697 9.49794 16.9697 10Z"/>
						<path d="M0.909091 10.9091H2.12109C2.62321 10.9091 3.03018 10.5021 3.03018 10C3.03018 9.49794 2.62321 9.09091 2.12109 9.09091H0.909091C0.407091 9.09091 0 9.49794 0 10C0 10.5021 0.407091 10.9091 0.909091 10.9091Z"/>
						<path d="M15.5711 5.33795C15.8039 5.33795 16.0366 5.24916 16.214 5.07159L17.071 4.21444C17.426 3.85941 17.426 3.28383 17.071 2.9288C16.7159 2.57377 16.1403 2.57383 15.7853 2.92892L14.9282 3.78607C14.5733 4.14104 14.5733 4.71674 14.9284 5.07171C15.1059 5.24922 15.3385 5.33795 15.5711 5.33795Z"/>
						<path d="M4.2146 17.071L5.07163 16.2139C5.42666 15.8589 5.42666 15.2833 5.07163 14.9283C4.71666 14.5733 4.14102 14.5733 3.78599 14.9283L2.92896 15.7854C2.57393 16.1404 2.57393 16.716 2.92896 17.071C3.10642 17.2486 3.33914 17.3373 3.57175 17.3373C3.80442 17.3373 4.03702 17.2486 4.2146 17.071Z"/>
						<path d="M16.4281 17.3373C16.6608 17.3373 16.8934 17.2486 17.071 17.071C17.4259 16.7161 17.4259 16.1405 17.071 15.7854L16.2139 14.9283C15.859 14.5733 15.2833 14.5733 14.9283 14.9282C14.5733 15.2832 14.5732 15.8589 14.9282 16.2139L15.7853 17.071C15.9628 17.2486 16.1955 17.3373 16.4281 17.3373Z"/>
						<path d="M3.78593 5.0717C3.96345 5.24921 4.19611 5.338 4.42872 5.338C4.66138 5.338 4.89405 5.24921 5.07157 5.07176C5.42654 4.71679 5.42654 4.14115 5.07157 3.78606L4.2146 2.92897C3.85963 2.574 3.28393 2.57394 2.92896 2.92897C2.57393 3.28394 2.57387 3.85952 2.9289 4.21461L3.78593 5.0717Z"/>
					</svg>
					Лето 🙂  
				</button>
				<button className="Button">
					<svg className="Button__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M18.4105 14.0677L16.3792 12.8949L18.1396 11.8569C18.4643 11.6654 18.5723 11.247 18.3809 10.9223C18.1893 10.5976 17.7711 10.4898 17.4462 10.6811L15.0214 12.111L13.5943 11.2871V8.71295L15.0206 7.8894L17.4463 9.31919C17.5551 9.38334 17.6744 9.41373 17.7923 9.41373C18.026 9.41373 18.2535 9.29361 18.3809 9.07767C18.5723 8.75299 18.4642 8.33457 18.1395 8.14311L16.3788 7.10526L18.4105 5.93218C18.7369 5.74372 18.8488 5.3263 18.6603 4.99989C18.4719 4.67347 18.0543 4.56163 17.728 4.75009L15.6965 5.92299L15.6782 3.87904C15.6748 3.50212 15.3659 3.197 14.9896 3.20273C14.6126 3.2061 14.3098 3.51441 14.3132 3.89133L14.3385 6.70695L12.9116 7.53077L10.6825 6.24367V4.59648L13.1336 3.21111C13.4617 3.02565 13.5774 2.60932 13.392 2.28109C13.2065 1.95294 12.79 1.83719 12.462 2.02274L10.6825 3.02856V0.682498C10.6825 0.305577 10.377 0 9.99996 0C9.62295 0 9.31747 0.305577 9.31747 0.682498V3.02856L7.53788 2.02283C7.20964 1.83719 6.79322 1.95304 6.60786 2.28118C6.4224 2.60932 6.53806 3.02574 6.86621 3.2112L9.31747 4.59658V6.24394L7.08843 7.53086L5.66137 6.70695L5.68667 3.89142C5.69004 3.5145 5.38728 3.20619 5.01027 3.20282C5.00808 3.20282 5.00608 3.20282 5.00408 3.20282C4.63007 3.20282 4.32504 3.50431 4.32167 3.87923L4.30329 5.92299L2.27209 4.75018C1.9454 4.56163 1.52807 4.67356 1.33979 4.99998C1.15133 5.32639 1.26317 5.74381 1.58959 5.93227L3.62134 7.10535L1.86031 8.1432C1.53553 8.33457 1.42743 8.75299 1.61889 9.07776C1.74611 9.29371 1.9737 9.41383 2.20748 9.41383C2.32523 9.41383 2.44462 9.38334 2.55337 9.31928L4.97933 7.88949L6.40584 8.71313V11.2871L4.9786 12.1112L2.55346 10.6812C2.22886 10.4897 1.81054 10.5977 1.61889 10.9224C1.42743 11.2471 1.53553 11.6655 1.86013 11.857L3.6207 12.895L1.58959 14.0677C1.26317 14.2562 1.15133 14.6736 1.33979 15C1.46628 15.219 1.6956 15.3414 1.93147 15.3414C2.04723 15.3414 2.16471 15.3118 2.27209 15.2498L4.30329 14.0771L4.32167 16.121C4.32504 16.4959 4.62998 16.7974 5.00408 16.7974C5.00608 16.7974 5.00827 16.7974 5.01027 16.7974C5.38719 16.794 5.69004 16.4857 5.68667 16.1088L5.66128 13.293L7.08834 12.469L9.31747 13.7561V15.4037L6.86621 16.7891C6.53815 16.9745 6.4224 17.3909 6.60786 17.7191C6.73335 17.9411 6.96458 18.0659 7.20263 18.0659C7.31638 18.0659 7.43177 18.0374 7.53788 17.9774L9.31747 16.9717V19.3176C9.31747 19.6945 9.62295 20.0001 9.99996 20.0001C10.377 20.0001 10.6825 19.6945 10.6825 19.3176V16.9717L12.4621 17.9774C12.5682 18.0374 12.6835 18.0659 12.7973 18.0659C13.0354 18.0659 13.2666 17.9411 13.3921 17.7191C13.5775 17.3909 13.4619 16.9745 13.1337 16.7891L10.6826 15.4037V13.7562L12.9118 12.469L14.3386 13.2928L14.3126 16.1085C14.3092 16.4854 14.6119 16.7938 14.9888 16.7973C14.9909 16.7974 14.9931 16.7974 14.9952 16.7974C15.3692 16.7974 15.6742 16.4959 15.6776 16.1211L15.6965 14.0767L17.7281 15.2497C17.8357 15.3118 17.953 15.3413 18.0687 15.3413C18.3046 15.3413 18.534 15.2188 18.6604 14.9999C18.8488 14.6736 18.7368 14.2562 18.4105 14.0677ZM7.77083 8.71304L10.0001 7.42585L12.2293 8.71304V11.287L10.0001 12.5742L7.77083 11.287V8.71304Z" />
					</svg>
					Метель 🔥 
				</button>
				<button className="Button">
					<svg className="Button__icon" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
						<path d="M16.1344 8.48337C13.9113 8.48337 12.1028 10.2918 12.1028 12.5148C12.1028 14.3698 13.6119 15.879 15.4668 15.879C15.8504 15.879 16.1615 15.568 16.1615 15.1842C16.1615 14.8005 15.8504 14.4895 15.4668 14.4895C14.378 14.4895 13.4922 13.6037 13.4922 12.5148C13.4922 11.058 14.6774 9.87284 16.1344 9.87284C18.0512 9.87284 19.6105 11.4322 19.6105 13.3488C19.6105 15.8407 17.5833 17.868 15.0915 17.868H0.694735C0.311056 17.868 0 18.179 0 18.5628C0 18.9465 0.311056 19.2575 0.694735 19.2575H15.0915C18.3494 19.2575 21 16.6069 21 13.3488C21 10.666 18.8173 8.48337 16.1344 8.48337Z"/>
						<path d="M0.694735 14.0401H7.16865C9.34864 14.0401 11.1222 12.2666 11.1222 10.0866C11.1222 8.26624 9.64108 6.78516 7.8205 6.78516C6.28745 6.78516 5.04026 8.03235 5.04026 9.5654C5.04026 10.8683 6.10033 11.9284 7.40329 11.9284C7.78697 11.9284 8.09802 11.6175 8.09802 11.2337C8.09802 10.8499 7.78697 10.539 7.40329 10.539C6.86649 10.539 6.42973 10.1022 6.42973 9.5654C6.42973 8.79859 7.0536 8.17463 7.8205 8.17463C8.87483 8.17463 9.73269 9.03239 9.73269 10.0866C9.73269 11.5005 8.58248 12.6507 7.16865 12.6507H0.694735C0.311056 12.6507 0 12.9616 0 13.3454C0 13.7292 0.311056 14.0401 0.694735 14.0401Z"/>
						<path d="M12.0793 7.34577H16.9349C18.6145 7.34577 19.981 5.97927 19.981 4.29958C19.981 2.88955 18.8338 1.74249 17.4238 1.74249C16.2293 1.74249 15.2576 2.7142 15.2576 3.90868C15.2576 4.93059 16.089 5.76205 17.1108 5.76205C17.4433 5.76205 17.7129 5.49249 17.7129 5.15994C17.7129 4.8274 17.4433 4.55784 17.1108 4.55784C16.7529 4.55784 16.4618 4.26661 16.4618 3.90868C16.4618 3.37818 16.8934 2.9467 17.4238 2.9467C18.1699 2.9467 18.7768 3.55362 18.7768 4.29958C18.7768 5.31529 17.9506 6.14156 16.9349 6.14156H12.0793C11.7468 6.14156 11.4772 6.41112 11.4772 6.74366C11.4772 7.07621 11.7469 7.34577 12.0793 7.34577Z"/>
					</svg>
					Буря
				</button>
				<button className={ classNames('Button', { 'Button--active': activeWeather === 'beach' }) } onClick={() => setWeather(beachAudio, beachVideo, 'beach')}>
					<svg className="Button__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M3.85565 5.93558C5.01979 5.93558 6.12482 5.46177 6.92847 4.65406C7.73222 5.46188 8.83715 5.93558 10.0013 5.93558C11.1656 5.93558 12.2705 5.46198 13.0737 4.65437C13.8773 5.46198 14.9822 5.93558 16.1465 5.93558C17.6871 5.93558 19.1237 5.10598 19.8959 3.77066C20.112 3.39683 19.9842 2.91854 19.6104 2.70243C19.2365 2.48653 18.7582 2.61413 18.5421 2.98797C18.0487 3.84155 17.1307 4.37186 16.1466 4.37186C15.1623 4.37186 14.2441 3.84155 13.7507 2.98797C13.6109 2.74632 13.3529 2.59735 13.0737 2.59745C12.7944 2.59745 12.5365 2.74643 12.3968 2.98818C11.9037 3.84176 10.9859 4.37186 10.0015 4.37186C9.0175 4.37186 8.09928 3.84145 7.60515 2.98766C7.46535 2.74611 7.20744 2.59735 6.92847 2.59735H6.92826C6.64919 2.59735 6.39128 2.74622 6.25159 2.98786C5.75818 3.84145 4.84017 4.37176 3.85597 4.37176C2.87166 4.37176 1.95344 3.84145 1.46003 2.98786C1.24393 2.61413 0.765636 2.48612 0.391802 2.70233C0.0179684 2.91843 -0.109944 3.39672 0.106267 3.77056C0.878015 5.10598 2.31476 5.93558 3.85565 5.93558Z"/>
						<path d="M19.6094 8.43598C19.2356 8.22008 18.7573 8.34757 18.5412 8.72151C18.0477 9.5751 17.1297 10.1054 16.1456 10.1054C15.1613 10.1054 14.2431 9.5751 13.7497 8.72151C13.6099 8.47986 13.3519 8.33089 13.0727 8.331C12.7934 8.331 12.5355 8.47997 12.3958 8.72172C11.9027 9.5753 10.9849 10.1054 10.0005 10.1054C9.01653 10.1054 8.09831 9.57499 7.60418 8.7212C7.46438 8.47966 7.20647 8.33089 6.9275 8.33089H6.92729C6.64822 8.33089 6.39031 8.47976 6.25062 8.72141C5.75721 9.57499 4.8392 10.1053 3.855 10.1053C2.87069 10.1053 1.95247 9.57499 1.45906 8.72141C1.24296 8.34757 0.764667 8.21966 0.390833 8.43587C0.0169995 8.65198 -0.110913 9.13027 0.105298 9.5041C0.877359 10.8395 2.31411 11.6691 3.8551 11.6691C5.01924 11.6691 6.12427 11.1953 6.92792 10.3876C7.73167 11.1954 8.8366 11.6691 10.0007 11.6691C11.1651 11.6691 12.2699 11.1955 13.0731 10.3879C13.8768 11.1955 14.9816 11.6691 16.146 11.6691C17.6865 11.6691 19.1232 10.8396 19.8953 9.5041C20.111 9.13037 19.9832 8.65208 19.6094 8.43598Z"/>
						<path d="M19.6094 14.1696C19.2356 13.9536 18.7573 14.0812 18.5412 14.4552C18.0477 15.3087 17.1297 15.8391 16.1456 15.8391C15.1613 15.8391 14.2431 15.3087 13.7497 14.4552C13.6099 14.2135 13.3519 14.0645 13.0727 14.0647C12.7934 14.0647 12.5355 14.2136 12.3958 14.4554C11.9027 15.309 10.9849 15.8391 10.0005 15.8391C9.01653 15.8391 8.09831 15.3086 7.60418 14.4549C7.46438 14.2133 7.20647 14.0646 6.9275 14.0646H6.92729C6.64822 14.0646 6.39031 14.2134 6.25062 14.4551C5.75721 15.3086 4.8392 15.839 3.855 15.839C2.87069 15.839 1.95247 15.3086 1.45906 14.4551C1.24296 14.0812 0.764667 13.9534 0.390833 14.1695C0.0169995 14.3856 -0.110913 14.8639 0.105298 15.2378C0.877359 16.5732 2.31411 17.4028 3.8551 17.4028C5.01924 17.4028 6.12427 16.929 6.92792 16.1213C7.73167 16.9291 8.8366 17.4028 10.0007 17.4028C11.1651 17.4028 12.2699 16.9292 13.0731 16.1216C13.8768 16.9292 14.9816 17.4028 16.146 17.4028C17.6865 17.4028 19.1232 16.5732 19.8953 15.2378C20.111 14.864 19.9832 14.3857 19.6094 14.1696Z"/>
					</svg>
					Море
				</button>
				<button className="Button">
					<svg className="Button__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M19.7238 12.6429C19.4521 12.3713 19.0427 12.2916 18.6891 12.4414C17.6374 12.8868 16.5222 13.1127 15.3743 13.1127C13.1074 13.1127 10.9764 12.23 9.37355 10.6271C6.91574 8.1694 6.20367 4.51287 7.55941 1.31174C7.70922 0.95795 7.62945 0.548693 7.35777 0.277091C7.08617 0.00541137 6.67676 -0.0741589 6.32312 0.0756457C5.09285 0.596857 3.98766 1.34256 3.03824 2.29205C1.07875 4.25147 -0.000234337 6.85658 3.81748e-08 9.62756C0.000234413 12.3981 1.0793 15.0029 3.03848 16.9622C4.99797 18.9217 7.60324 20.0009 10.3742 20.0009C13.1448 20.0009 15.7496 18.9219 17.7089 16.9626C18.6584 16.0131 19.4041 14.9079 19.9253 13.6778C20.0751 13.324 19.9954 12.9147 19.7238 12.6429Z"/>
					</svg>
					Ночь
				</button>
				<button className="Button">
					<svg className="Button__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M11.3368 16.825H8.60742C8.36172 16.825 8.1618 17.0249 8.1618 17.2706V19.5544C8.1618 19.8001 8.36172 20 8.60742 20H11.3368C11.5825 20 11.7825 19.8001 11.7825 19.5544V17.2706C11.7825 17.0249 11.5825 16.825 11.3368 16.825Z"/>
						<path d="M17.1611 14.8127L14.3206 10.5863H15.2523C15.4145 10.5863 15.5514 10.5098 15.6185 10.3816C15.686 10.2527 15.6705 10.0953 15.5772 9.96059L12.6543 5.74019H13.6977C13.8486 5.74019 13.9749 5.66878 14.0354 5.54913C14.0959 5.42992 14.0791 5.28671 13.9905 5.1659L10.3234 0.168945C10.2447 0.0615511 10.127 0 10.0006 0C9.87387 0 9.75578 0.0618854 9.67668 0.169725L6.00946 5.16551C5.92089 5.28627 5.90412 5.42965 5.96456 5.54896C6.02528 5.66867 6.1515 5.74013 6.30228 5.74013H7.34537L4.42288 9.96115C4.32953 10.0958 4.31404 10.2531 4.38144 10.3818C4.44845 10.5098 4.58537 10.5862 4.74768 10.5862H5.6792L2.83893 14.8138C2.7395 14.9617 2.72391 15.1322 2.79727 15.27C2.86996 15.4065 3.01796 15.488 3.19309 15.488H16.8069C16.9818 15.488 17.1297 15.4064 17.2026 15.2697C17.2762 15.1316 17.2607 14.9607 17.1611 14.8127Z"/>
					</svg>
					Лес
				</button>
			</div>
		</div>
	);
}

export default App;
