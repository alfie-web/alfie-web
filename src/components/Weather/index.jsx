import React from 'react';
import classNames from 'classnames';

import './Weather.sass';

export default function Weather({ item, activeWeather, setWeather }) {
	const { title, icon, audio, video, _id } = item;
	return (
		<button 
			className={ classNames('Button', { 'Button--active': activeWeather === _id }) } 
			onClick={() => setWeather(audio, video, _id)}>
			<img src={ icon } alt="Weather icon"/>
			{ title }
		</button>
	)
}
