import React, { Component } from 'react';
import {Link} from 'react-router';
import "./resources/custom.css"
import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
const cat = require('./resources/cat.jpg');
const videoURL = require('./resources/elephants-dream-medium.mp4');

class Canvas extends Component {
	constructor() {
		super();
		this.state = {
			value: 0,
			playing: false,
			played: 0,
			duration: 0,
			valume: 0.3,
			home: document.location.hostname,
			activeIMG: cat,
			croppedIMG: '',
			aspectRatioValue: 'free',
			aspectRatioNumber: 'free',
			cropBoxData: {width: 0, height: 0},
			settingsIMG: {
				w: 300,
				h: 240,
				ratio: 0,
			}
		}
	}
	parseRatio = (value)=> {
		//value is string 16:9, 4:3 or 'free' etc
		if(value === 'free') {
			return 'free';
		}
		else if (typeof value === 'string' && value !== '') {
			const num = value.split(':');
			return Number(num[0]) / Number(num[1]);
		} 
		throw 'Ratio must me a number'
	}
	handleSetup = () => {
		var videoInfo = { duration: this.video.duration, width: this.video.videoWidth, height: this.video.videoHeight };
		this.context = this.canvas.getContext('2d');
		// Calculate the ratio of the video's width to height
		const ratio = this.video.videoWidth / this.video.videoHeight;
		// Define the required width as 100 pixels smaller than the actual video's width
		const w = this.video.videoWidth // - 100;
		// Calculate the height based on the video's width and the ratio
		const h = parseInt(w / ratio, 10)
		// Set the canvas width and height to the values just calculated
		// to cluterring and not needed for this 
		this.canvas.style = 'display: none'
		this.canvas.width = w;
		this.canvas.height = h;			
		console.log(videoInfo);
		this.setState({
			duration: this.video.duration,
			settingsIMG: {...this.state.settingsIMG, w, ratio, h}
		})
	}

	snap = () => {
		const { w, h } = this.state.settingsIMG;
		// this.img.src = this.canvas.toDataURL();
		// Define the size of the rectangle that will be filled (basically the entire element)
		this.context.fillRect(0, 0, w, h);
		// Grab the image from the video
		this.context.drawImage(this.video, 0, 0, w, h);
		const activeIMG = this.canvas.toDataURL();
		this.setState({ activeIMG });
	}
	crop = () => {
		// image in dataUrl
		const croppedIMG = this.refs.cropper.getCroppedCanvas().toDataURL();
		this.setState({croppedIMG})
	}
	playPause = () => {
		if(this.state.playing) {
			this.video.pause();
		} else {
			this.video.play();
		}
		this.setState({ playing: !this.state.playing })
	}
	handleChange = () => {
		const {value, duration} = this.state;
		const time = duration * (value / 100);
		this.video.currentTime = time; 

		this.setState({value: time})
	}
	handleTimeUpdate = () => {
		const value = (100 / this.state.duration) * this.video.currentTime;
		this.setState({value});
	}
	cropBoxData = () => {
		const cropper = this.refs.cropper;
		this.setState({cropBoxData: cropper.getCropBoxData()})
		// console.log(cropper.getCropBoxData());
	}
	setUpRatio = (e) => {
		const element = e.target;
		const value = element.value;
		const obj = {element, value, ratioNum: this.parseRatio(value)};
		console.log(value, typeof value)
		this.setState({aspectRatioValue: value, aspectRatioNumber: this.parseRatio(value)})
	}
	settingCropBoxData = () => {
		const cropper = this.refs.cropper; 
		let data = {};
		data.width = 220;
		data.height = 140;
		cropper.setCropBoxData(data)
		this.setState({aspectRatioNumber: 'free', aspectRatioValue: 'free'})
	}

	render() {
		const { home, duration, played } = this.state;
		console.log(home);
		return(
			<div>
				<h2> Rapid Prototyping - Screenshoot/Video Cropper</h2>
				<ul><li><Link to="/remote">Remote Version - Different player </Link></li></ul>
				<video onTimeUpdate={this.handleTimeUpdate}ref={video => this.video = video} onLoadedMetadata={this.handleSetup} >
					{/* <source src="https://html5multimedia.com/code/media/elephants-dream-medium.mp4" type="video/mp4" /> */}
					<source src={videoURL} type="video/mp4" />
				</video>
				<div id="controls">
					<button className="fixed" onClick={this.playPause}>{!this.state.playing ? 'Play' : 'Pause'}</button>
					<button className="fixed" onClick={this.crop}>Crop</button>
					<button id="snap" onClick={this.snap}>Snap</button>
					<select value={this.state.aspectRatioValue} onChange={this.setUpRatio}>
						<option value="16:9{16 / 9}">16:9</option>
						<option value="4:3">4:3</option>
						<option value="1:1">1:1</option>
						<option value="2:3">2:3</option>
						<option value='free'>Free</option>
					</select>
					<button onClick ={this.settingCropBoxData}>220x140</button>
					<input type='range' value={this.state.value} onChange={this.handleChange} min={0} max={duration}/>
				</div>
				<canvas ref={canvas => this.canvas = canvas}></canvas>
				<br />
				<h3>Image Preview</h3>
				<p><strong>Width: </strong>{Math.round(this.state.cropBoxData.width)}<strong>Height</strong>{Math.round(this.state.cropBoxData.height)}</p>
				<button onClick={this.cropBoxData}>GetCropBoxData</button>
				<div>
					<Cropper
						ref='cropper'
						src={this.state.activeIMG}
						style={{height: this.state.settingsIMG.h, width: this.state.settingsIMG.w}}
						aspectRatio={this.state.aspectRatioNumber}
						guides={false}
						viewMode={3}
						cropmove={this.cropBoxData}
					/>
				</div>
				<img src={this.state.croppedIMG} />
			</div>
		)
	}
}

export default Canvas;
