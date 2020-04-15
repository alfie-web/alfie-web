import React, { Fragment, Component, createRef } from 'react';
import classNames from 'classnames';

const trackRef = createRef();
const audioRef = createRef();
const videoRef = createRef();
const timeRef = createRef();

export default class Player extends Component {
	state = {
		fakeDuration: 600,
		outlineLength: null
	}


	setDuration = e => {
		audioRef.current.currentTime = 0;	
		this.setState({
			fakeDuration: +e.target.name
		})
	}

	toTimeFormat = num => {
		return (+num >= 0 && +num <= 9) ? '0' + num : num;
	}

	stopSound = () => {
		audioRef.current.pause();
		videoRef.current.pause();

		this.props.setIsPlaying(false);
	}

	playSound = () => {
		if (this.props.isPlaying) {
			this.stopSound();
		} else {
			audioRef.current.play();
			videoRef.current.play();
			
			this.props.setIsPlaying(true);
		}
	}

	
	resetSound = (currentTime) => {
		console.log('До условия', this.props.isLooped)
		if (currentTime >= this.state.fakeDuration) {
			if (this.props.isLooped) {
				console.log('Зациклено', this.props.isLooped)
			} else {
				console.log('Не зациклено', this.props.isLooped)
				this.stopSound();
			}
			audioRef.current.currentTime = 0;
			videoRef.current.currentTime = 0;
		}
	}
	

	
	onPlay = () => {
		let currentTime = audioRef.current.currentTime;
		let elapsedTime = this.state.fakeDuration - currentTime;

		// Сразу оптимизации вагон
		let seconds = Math.floor(elapsedTime % 60);
		let minutes = Math.floor(elapsedTime / 60);
		timeRef.current.textContent = `${this.toTimeFormat(minutes)}:${this.toTimeFormat(seconds)}`;

		let progress = this.state.outlineLength - (currentTime / this.state.fakeDuration) * this.state.outlineLength;
		trackRef.current.style.strokeDashoffset = progress;

		// if (currentTime >= this.state.fakeDuration) {
			this.resetSound(currentTime);
		// }
	}


	// TODO: Поработать над зацикливанием

	componentDidMount() {
		let length = trackRef.current.getTotalLength()
		this.setState({
			outlineLength: length
		})
		trackRef.current.style.strokeDasharray = length;
		trackRef.current.style.strokeDashoffset = length;

		audioRef.current.addEventListener('timeupdate', this.onPlay);
	}

	// Но это скорее всего не нужно
	componentWillUnmount() {
		audioRef.current.removeEventListener('timeupdate', this.onPlay);
	}

	render()  {
		console.log(this.props.isLooped)
		return (<Fragment>
		<div className="App__video">
			<video ref={videoRef} src={this.props.activeVideo} loop></video>
		</div>

		<div className="App__player">
			<div className="App__player-track">
				<button onClick={ this.playSound } className="Button Button--active" title={ this.props.isPlaying ? 'Отстановить' : 'Проигрывать' }>
					{ this.props.isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
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
			<audio ref={audioRef} src={this.props.activeAudio}></audio>
			<h1 ref={timeRef} className="App__player-time">00:00</h1>
		</div>

		<div className="App__times">
			<button className={ classNames('Button', { 'Button--active': this.state.fakeDuration === 10 }) } name="10" title="2 минуты" onClick={this.setDuration}>2 минуты</button>
			<button className={ classNames('Button', { 'Button--active': this.state.fakeDuration === 300 }) } title="5 минут" name="300" onClick={this.setDuration}>5 минут</button>
			<button className={ classNames('Button', { 'Button--active': this.state.fakeDuration === 600 }) } title="10 минут" name="600" onClick={this.setDuration}>10 минут</button>
		</div>

		<div className="App__controls">
				<button className={ classNames('Button', { 'Button--active': this.props.isLooped }) } onClick={ this.props.setLoop } title="Зациклить">
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
				<button className="Button" title="Во весь экран" onClick={this.props.goFull}>
					{ this.props.isFullscreen ? <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 9.75C21.6904 9.75 22.25 9.19035 22.25 8.5C22.25 7.80964 21.6904 7.25 21 7.25L21 9.75ZM16.5 8.50001L16.5 9.75001L16.5 9.75001L16.5 8.50001ZM14.5 6.50001L15.75 6.50001L15.75 6.50001L14.5 6.50001ZM15.75 2C15.75 1.30964 15.1904 0.75 14.5 0.75C13.8096 0.75 13.25 1.30964 13.25 2L15.75 2ZM1.5 13.75C0.809646 13.75 0.250001 14.3097 0.25 15C0.249999 15.6904 0.809642 16.25 1.5 16.25L1.5 13.75ZM6 15L6 16.25H6V15ZM8 17L9.25 17V17H8ZM6.75 21.5C6.75 22.1904 7.30964 22.75 8 22.75C8.69036 22.75 9.25 22.1904 9.25 21.5L6.75 21.5ZM21 7.25L16.5 7.25001L16.5 9.75001L21 9.75L21 7.25ZM15.75 6.50001L15.75 2L13.25 2L13.25 6.50001L15.75 6.50001ZM16.5 7.25001C16.0858 7.25001 15.75 6.91422 15.75 6.50001L13.25 6.50001C13.25 8.29493 14.7051 9.75001 16.5 9.75001L16.5 7.25001ZM1.5 16.25L6 16.25L6 13.75L1.5 13.75L1.5 16.25ZM6.75 17L6.75 21.5L9.25 21.5L9.25 17L6.75 17ZM6 16.25C6.41421 16.25 6.75 16.5858 6.75 17H9.25C9.25 15.2051 7.79493 13.75 6 13.75V16.25Z"/>
					</svg>
					: <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
						<path d="M13 0.75C12.3096 0.750001 11.75 1.30965 11.75 2C11.75 2.69036 12.3096 3.25 13 3.25L13 0.75ZM17.5 1.99999L17.5 0.749992L17.5 0.749992L17.5 1.99999ZM18.25 8.5C18.25 9.19036 18.8096 9.75 19.5 9.75C20.1904 9.75 20.75 9.19036 20.75 8.5H18.25ZM8.5 20.75C9.19035 20.75 9.75 20.1904 9.75 19.5C9.75 18.8096 9.19036 18.25 8.5 18.25L8.5 20.75ZM4 19.5L4 18.25L4 18.25L4 19.5ZM2 17.5L0.75 17.5L0.75 17.5L2 17.5ZM3.25 13C3.25 12.3096 2.69036 11.75 2 11.75C1.30964 11.75 0.75 12.3096 0.75 13L3.25 13ZM13 3.25L17.5 3.24999L17.5 0.749992L13 0.75L13 3.25ZM18.25 3.99999V8.5H20.75V3.99999H18.25ZM17.5 3.24999C17.9142 3.24999 18.25 3.58578 18.25 3.99999H20.75C20.75 2.20507 19.2949 0.749992 17.5 0.749992V3.24999ZM8.5 18.25L4 18.25L4 20.75L8.5 20.75L8.5 18.25ZM3.25 17.5L3.25 13L0.75 13L0.75 17.5L3.25 17.5ZM4 18.25C3.58579 18.25 3.25 17.9142 3.25 17.5L0.75 17.5C0.75 19.2949 2.20508 20.75 4 20.75L4 18.25Z"/>
					</svg> }
				</button>
			</div>
		</Fragment>)
	}
}






























// Хуки это боль
// Как выриант можно попробовать вынести все части стэйта в родителя, а тут оставить минимум логики
//  Я как понял проблема даже не в useCallback, а в том, что компонент постоянно перерисовывается




// import React, { Fragment, useState, createRef, useEffect, useCallback } from 'react';
// import classNames from 'classnames';
// import { connect } from 'react-redux';
// import { playerActions } from '../../redux/actions';

// const trackRef = createRef();
// const audioRef = createRef();
// const videoRef = createRef();
// const timeRef = createRef();

// function Player({ setIsPlaying, isPlaying, isLooped, setLoop, activeAudio, activeVideo, goFull, isFullscreen }) {
// 	const [fakeDuration, setFakeDuration] = useState(600);
// 	// const [outlineLength, setOutlineLength] = useState(null);

// 	// const trackRef = useRef();
// 	// const audioRef = useRef();
// 	// const videoRef = useRef();
// 	// const timeRef = useRef();

// 	console.log(isLooped)

// 	const setDuration = e => {
// 		audioRef.current.currentTime = 0;		// Здесь тоже произойдёт timeupdate
// 		setFakeDuration(+e.target.name);
// 	}

// 	const toTimeFormat = num => {
// 		return (+num >= 0 && +num <= 9) ? '0' + num : num;
// 	}

	
	

	
// 	// const onPlay = () => {
// 	// 	let currentTime = audioRef.current.currentTime;
// 	// 	let elapsedTime = fakeDuration - currentTime;

// 	// 	// Сразу оптимизации вагон
// 	// 	let seconds = Math.floor(elapsedTime % 60);
// 	// 	let minutes = Math.floor(elapsedTime / 60);
// 	// 	timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;

// 	// 	let outlineLength = trackRef.current.getTotalLength();

// 	// 	let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 	// 	trackRef.current.style.strokeDashoffset = progress;


// 	// 	resetSound(currentTime);
// 	// }

// 	const stopSound = () => {
// 		audioRef.current.pause();
// 		videoRef.current.pause();

// 		setIsPlaying(false);
// 	}

// 	const playSound = () => {
// 		if (isPlaying) {
// 			stopSound();
// 		} else {
// 			audioRef.current.play();
// 			videoRef.current.play();
			
// 			setIsPlaying(true);
// 		}
// 	}


// 	useEffect(() => {
		
	
		
// 		const resetSound = (currentTime) => {
// 			console.log('До условия', currentTime)
// 			if (currentTime >= fakeDuration) {
// 				if (isLooped) {
// 					console.log('Зациклено', isLooped)
// 				} else {
// 					console.log('Не зациклено', isLooped)
// 					stopSound();
// 				}
// 				// audioRef.current.currentTime = 0;
// 				// videoRef.current.currentTime = 0;
// 			}
// 		}

// 		const onPlay = () => {
// 			let currentTime = audioRef.current.currentTime;
// 			let elapsedTime = fakeDuration - currentTime;
	
// 			// Сразу оптимизации вагон
// 			let seconds = Math.floor(elapsedTime % 60);
// 			let minutes = Math.floor(elapsedTime / 60);
// 			timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;
	
// 			let outlineLength = trackRef.current.getTotalLength();
	
// 			let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 			trackRef.current.style.strokeDashoffset = progress;
	
	
// 			resetSound(currentTime);
// 		}


// 		trackRef.current.style.strokeDasharray = trackRef.current.getTotalLength();
// 		trackRef.current.style.strokeDashoffset = trackRef.current.getTotalLength();

// 		audioRef.current.addEventListener('timeupdate', onPlay);
// 	})

// 	// componentDidMount() {
// 	// 	let length = trackRef.current.getTotalLength()
// 	// 	this.setState({
// 	// 		outlineLength: length
// 	// 	})
// 	// 	trackRef.current.style.strokeDasharray = length;
// 	// 	trackRef.current.style.strokeDashoffset = length;

// 	// 	audioRef.current.addEventListener('timeupdate', this.onPlay);
// 	// }

// 	// Но это скорее всего не нужно
// 	// componentWillUnmount() {
// 	// 	audioRef.current.removeEventListener('timeupdate', this.onPlay);
// 	// }
// 	// 

// 	return (
// 		<Fragment>
// 		<div className="App__video">
// 			<video ref={videoRef} src={activeVideo} loop></video>
// 		</div>

// 		<div className="App__player">
// 			<div className="App__player-track">
// 				<button onClick={ playSound } className="Button Button--active" title={ isPlaying ? 'Отстановить' : 'Проигрывать' }>
// 					{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
// 						<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
// 					</svg> 
// 					: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
// 					</svg>
// 				}
// 				</button>
// 				<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 					<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 				</svg>
// 				<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 					<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 				</svg>
// 			</div>
// 			<audio ref={audioRef} src={activeAudio}></audio>
// 			<h1 ref={timeRef} className="App__player-time">00:00</h1>
// 		</div>

// 		<div className="App__times">
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 10 }) } name="10" title="2 минуты" onClick={setDuration}>2 минуты</button>
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут" name="300" onClick={setDuration}>5 минут</button>
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут" name="600" onClick={setDuration}>10 минут</button>
// 		</div>

// 		<div className="App__controls">
// 				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить">
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
// 				<button className="Button" title="Следующий">
// 					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M15.5001 8.13397C16.1667 8.51887 16.1667 9.48112 15.5001 9.86602L2.00006 17.6602C1.33339 18.0451 0.500061 17.564 0.500061 16.7942L0.500062 1.20576C0.500062 0.43596 1.3334 -0.0451642 2.00006 0.339736L15.5001 8.13397Z"/>
// 						<path d="M17.9167 1.89582C17.9167 1.263 17.4037 0.749991 16.7709 0.749991C16.1381 0.749991 15.6251 1.263 15.6251 1.89582V16.1042C15.6251 16.737 16.1381 17.25 16.7709 17.25C17.4037 17.25 17.9167 16.737 17.9167 16.1042V1.89582Z"/>
// 					</svg>
// 				</button>
// 				<button className="Button" title="Предыдущий">
// 					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M2.41667 8.13398C1.75 8.51888 1.75 9.48113 2.41667 9.86603L15.9167 17.6603C16.5833 18.0452 17.4167 17.564 17.4167 16.7942V1.20577C17.4167 0.435972 16.5833 -0.0451528 15.9167 0.339747L2.41667 8.13398Z"/>
// 						<path d="M0 1.89584C0 1.26301 0.513007 0.750002 1.14583 0.750002C1.77866 0.750002 2.29167 1.26301 2.29167 1.89584V16.1042C2.29167 16.737 1.77866 17.25 1.14583 17.25C0.513007 17.25 0 16.737 0 16.1042V1.89584Z"/>
// 					</svg>		
// 				</button>
// 				<button className="Button" title="Во весь экран" onClick={goFull}>
// 					{ isFullscreen ? <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M21 9.75C21.6904 9.75 22.25 9.19035 22.25 8.5C22.25 7.80964 21.6904 7.25 21 7.25L21 9.75ZM16.5 8.50001L16.5 9.75001L16.5 9.75001L16.5 8.50001ZM14.5 6.50001L15.75 6.50001L15.75 6.50001L14.5 6.50001ZM15.75 2C15.75 1.30964 15.1904 0.75 14.5 0.75C13.8096 0.75 13.25 1.30964 13.25 2L15.75 2ZM1.5 13.75C0.809646 13.75 0.250001 14.3097 0.25 15C0.249999 15.6904 0.809642 16.25 1.5 16.25L1.5 13.75ZM6 15L6 16.25H6V15ZM8 17L9.25 17V17H8ZM6.75 21.5C6.75 22.1904 7.30964 22.75 8 22.75C8.69036 22.75 9.25 22.1904 9.25 21.5L6.75 21.5ZM21 7.25L16.5 7.25001L16.5 9.75001L21 9.75L21 7.25ZM15.75 6.50001L15.75 2L13.25 2L13.25 6.50001L15.75 6.50001ZM16.5 7.25001C16.0858 7.25001 15.75 6.91422 15.75 6.50001L13.25 6.50001C13.25 8.29493 14.7051 9.75001 16.5 9.75001L16.5 7.25001ZM1.5 16.25L6 16.25L6 13.75L1.5 13.75L1.5 16.25ZM6.75 17L6.75 21.5L9.25 21.5L9.25 17L6.75 17ZM6 16.25C6.41421 16.25 6.75 16.5858 6.75 17H9.25C9.25 15.2051 7.79493 13.75 6 13.75V16.25Z"/>
// 					</svg>
// 					: <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M13 0.75C12.3096 0.750001 11.75 1.30965 11.75 2C11.75 2.69036 12.3096 3.25 13 3.25L13 0.75ZM17.5 1.99999L17.5 0.749992L17.5 0.749992L17.5 1.99999ZM18.25 8.5C18.25 9.19036 18.8096 9.75 19.5 9.75C20.1904 9.75 20.75 9.19036 20.75 8.5H18.25ZM8.5 20.75C9.19035 20.75 9.75 20.1904 9.75 19.5C9.75 18.8096 9.19036 18.25 8.5 18.25L8.5 20.75ZM4 19.5L4 18.25L4 18.25L4 19.5ZM2 17.5L0.75 17.5L0.75 17.5L2 17.5ZM3.25 13C3.25 12.3096 2.69036 11.75 2 11.75C1.30964 11.75 0.75 12.3096 0.75 13L3.25 13ZM13 3.25L17.5 3.24999L17.5 0.749992L13 0.75L13 3.25ZM18.25 3.99999V8.5H20.75V3.99999H18.25ZM17.5 3.24999C17.9142 3.24999 18.25 3.58578 18.25 3.99999H20.75C20.75 2.20507 19.2949 0.749992 17.5 0.749992V3.24999ZM8.5 18.25L4 18.25L4 20.75L8.5 20.75L8.5 18.25ZM3.25 17.5L3.25 13L0.75 13L0.75 17.5L3.25 17.5ZM4 18.25C3.58579 18.25 3.25 17.9142 3.25 17.5L0.75 17.5C0.75 19.2949 2.20508 20.75 4 20.75L4 18.25Z"/>
// 					</svg> }
// 				</button>
// 			</div>
// 		</Fragment>)
	
// }


// export default connect(
// 	({ player }) => ({ isLooped: player.isLooped }),
// 	playerActions
// )(Player);


































// C классовой компонентой все работает, а вот на хуках того же не скажешь.
// useCallback-и все мемоизируют и не реагируют на новое значение хз почему
// Но всё-таки написать на хуках попробовать стоит
// Как вариант попробовать useEffect без массива зависимостей (Пробовал, не вышло)


// import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
// import classNames from 'classnames';
// import { connect } from 'react-redux';
// import { playerActions } from '../../redux/actions';

// function Player({ activeAudio, activeVideo, isLooped, setIsPlaying, setIsLooped, isPlaying}) {
// 	const [fakeDuration, setFakeDuration] = useState(600);
// 	const [outlineLength, setOutlineLength] = useState(null);

// 	const trackRef = useRef();
// 	const audioRef = useRef();
// 	const videoRef = useRef();
// 	const timeRef = useRef();

// 	const setDuration = e => {
// 		audioRef.current.currentTime = 0;	// лучше это вынести в state
// 		setFakeDuration(+e.target.name);
// 	}

// 	const toTimeFormat = num => {
// 		return (+num >= 0 && +num <= 9) ? '0' + num : num;
// 	}

// 	const setLoop = () => {
// 		console.log('Циклю')
// 		setIsLooped(!isLooped)
// 		// changePlayerState({
// 		// 	isLooped: !playerState.isLooped
// 		// })
// 	}

// 	console.log(isLooped)


// 	const stopSound = useCallback(() => {
// 		audioRef.current.pause();
// 		videoRef.current.pause();

// 		setIsPlaying(false);
// 	}, [setIsPlaying])

// 	const playSound = useCallback(() => {
// 		if (isPlaying) {
// 			stopSound();
// 		} else {
// 			audioRef.current.play();
// 			videoRef.current.play();
// 			setIsPlaying(true);
// 		}
// 	}, [setIsPlaying, isPlaying, stopSound])

	

// 	// TODO: Поработать над зацикливанием
// 	useEffect(() => {
// 		const onPlay = () => {
// 			let currentTime = audioRef.current.currentTime;
// 			let elapsedTime = fakeDuration - currentTime;
	
// 			// Сразу оптимизации вагон
// 			let seconds = Math.floor(elapsedTime % 60);
// 			let minutes = Math.floor(elapsedTime / 60);
// 			timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;
	
// 			let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 			trackRef.current.style.strokeDashoffset = progress;
	
// 			if (isLooped) {
// 				console.log('Зациклено', isLooped)
// 			} else {
// 				console.log('Не зациклено', isLooped)
// 			}

// 			if (currentTime >= fakeDuration) {
// 				if (isLooped) {
// 					console.log('Зациклено', isLooped)
// 				} else {
// 					console.log('Не зациклено', isLooped)
// 					stopSound();
// 				}

// 				audioRef.current.currentTime = 0;
// 				videoRef.current.currentTime = 0;
// 			}
// 		}


// 		let length = trackRef.current.getTotalLength()
// 		setOutlineLength(length);
// 		trackRef.current.style.strokeDasharray = length;
// 		trackRef.current.style.strokeDashoffset = length;

// 		audioRef.current.addEventListener('timeupdate', onPlay);
// 	}, [isLooped, setOutlineLength, trackRef, audioRef, fakeDuration, outlineLength, stopSound])


// 	// useEffect(() => {
// 	// 	let length = trackRef.current.getTotalLength()
// 	// 	setOutlineLength(length);
// 	// 	trackRef.current.style.strokeDasharray = length;
// 	// 	trackRef.current.style.strokeDashoffset = length;
// 	// }, [setOutlineLength, trackRef])

// 	// useEffect(() => {
// 	// 	audioRef.current.addEventListener('timeupdate', onPlay);

// 	// 	// return () => {
// 	// 	// 	audioRef.current.removeEventListener('timeupdate', onPlay);
// 	// 	// }
// 	// }, [audioRef, onPlay])

// 	return (
// 		<Fragment>
// 		<div className="App__video">
// 			<video ref={videoRef} src={activeVideo} loop></video>
// 		</div>

// 		<div className="App__player">
// 			<div className="App__player-track">
// 				<button onClick={ playSound } className="Button Button--active" title={ isPlaying ? 'Отстановить' : 'Проигрывать' }>
// 					{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
// 						<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
// 					</svg> 
// 					: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
// 					</svg>
// 				}
// 				</button>
// 				<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 					<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 				</svg>
// 				<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 					<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 				</svg>
// 			</div>
// 			<audio ref={audioRef} src={activeAudio}></audio>
// 			<h1 ref={timeRef} className="App__player-time">00:00</h1>
// 		</div>

// 		<div className="App__times">
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 10 }) } name="10" title="2 минуты" onClick={setDuration}>2 минуты</button>
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут" name="300" onClick={setDuration}>5 минут</button>
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут" name="600" onClick={setDuration}>10 минут</button>
// 		</div>

// 		<div className="App__controls">
// 				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить">
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
// 				<button className="Button" title="Следующий">
// 					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M15.5001 8.13397C16.1667 8.51887 16.1667 9.48112 15.5001 9.86602L2.00006 17.6602C1.33339 18.0451 0.500061 17.564 0.500061 16.7942L0.500062 1.20576C0.500062 0.43596 1.3334 -0.0451642 2.00006 0.339736L15.5001 8.13397Z"/>
// 						<path d="M17.9167 1.89582C17.9167 1.263 17.4037 0.749991 16.7709 0.749991C16.1381 0.749991 15.6251 1.263 15.6251 1.89582V16.1042C15.6251 16.737 16.1381 17.25 16.7709 17.25C17.4037 17.25 17.9167 16.737 17.9167 16.1042V1.89582Z"/>
// 					</svg>
// 				</button>
// 				<button className="Button" title="Предыдущий">
// 					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M2.41667 8.13398C1.75 8.51888 1.75 9.48113 2.41667 9.86603L15.9167 17.6603C16.5833 18.0452 17.4167 17.564 17.4167 16.7942V1.20577C17.4167 0.435972 16.5833 -0.0451528 15.9167 0.339747L2.41667 8.13398Z"/>
// 						<path d="M0 1.89584C0 1.26301 0.513007 0.750002 1.14583 0.750002C1.77866 0.750002 2.29167 1.26301 2.29167 1.89584V16.1042C2.29167 16.737 1.77866 17.25 1.14583 17.25C0.513007 17.25 0 16.737 0 16.1042V1.89584Z"/>
// 					</svg>		
// 				</button>
// 			</div>
// 		</Fragment>
// 	)
// }

// export default connect(
// 	({ player }) => ({ isLooped: player.isLooped }),
// 	playerActions
// )(Player);