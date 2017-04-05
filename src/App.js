import React, { Component } from 'react'
import {Link} from 'react-router';
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import sha1 from 'sha1';
import 'normalize.css/normalize.css'
import './defaults.scss'
import './App.scss'
import './Range.scss'
import axios from 'axios';
import { version } from '../../package.json'
import ReactPlayer from '../ReactPlayer'
import Duration from './Duration'
import ShowThumbs from './ShowThumbs'
// import Cropper from 'react-cropper';
// import Crop from 'cropperjs';
import genPNG from './genPng.js'
// import 'cropperjs/dist/cropper.css'
// import './custom.css'
// import croppi from './croppi/js/imagecrop.min.js'
// import './croppi/css/imagecrop.min.css'
// import './croppi/css/imagecrop_white.min.css'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import Croppr from 'croppr';
import 'croppr/dist/croppr.css';
import "./resources/custom.css"


export default class App extends Component {
	state = {
		thumb: '',
		url: "http://techslides.com/demos/sample-videos/small.mp4",
		playing: false,
		volume: 0.09,
		played: 0,
		loaded: 0,
		duration: 0,
		playbackRate: 1.0,
		src: 'https://i.imgur.com/axu9ZMt.png',
		jpg: 'https://m0.joe.ie/wp-content/uploads/2015/04/24150817/ovERK17.jpg',
		cropIMG: '',
		settingsIMG: {
			w: 0,
			h: 0,
			ratio: 0,
		},
	}
	load = url => {
		this.setState({
			url,
			played: 0,
			loaded: 0
		})
	}
	playPause = () => {
		this.setState({ playing: !this.state.playing })
	}
	stop = () => {
		this.setState({ url: null, playing: false })
	}
	setVolume = e => {
		this.setState({ volume: parseFloat(e.target.value) })
	}
	setPlaybackRate = e => {
		console.log(parseFloat(e.target.value))
		this.setState({ playbackRate: parseFloat(e.target.value) })
	}
	onSeekMouseDown = e => {
		this.setState({ seeking: true })
	}
	onSeekChange = e => {
		this.setState({ played: parseFloat(e.target.value) })
		this.player.seekTo(parseFloat(e.target.value))
	}
	onSeekMouseUp = e => {
		this.setState({ seeking: false })
		this.player.seekTo(parseFloat(e.target.value))
	}
	onProgress = state => {
		// We only want to update time slider if we are not currently seeking
		if (!this.state.seeking) {
			this.setState(state)
		}
	}
	renderLoadButton = (url, label) => {
		return (
			<button onClick={() => this.load(url)}>
			{label}
			</button>
		)
	}
	loading = () => {
		console.log('...loading');
	}
	finishLoading = () => {
		console.log('finish loading');
	}
	onVideoLoad = () => {
		// tu radim setup
		this.video = document.querySelector('video');
		console.log('this is video', this.video);
		this.context = this.canvas.getContext('2d');
		// Calculate the ratio of the video's width to height
		const ratio = this.video.videoWidth / this.video.videoHeight;
		// Define the required width as 100 pixels smaller than the actual video's width
		const w = this.video.videoWidth - 300;
		// Calculate the height based on the video's width and the ratio
		const h = parseInt(w / ratio, 10);
		// Set the canvas width and height to the values just calculated
		this.canvas.width = w;
		this.canvas.height = h;			
		this.setState({
			duration: this.video.duration,
			settingsIMG: {...this.state.settingsIMG, w, ratio, h}
		})
		console.log('i am ready');

	}
	cropCanvas = () => {
		const { w, h } = this.state.settingsIMG;
		console.log(w, h);
		// this.img.src = this.canvas.toDataURL();
		// Define the size of the rectangle that will be filled (basically the entire element)
		this.context.fillRect(0, 0, w, h);
		// Grab the image from the video
		this.context.drawImage(this.video, 0, 0, w, h);
		// const activeIMG = this.canvas.toDataURL();
		// this.setState({ activeIMG });
	}
	snap = () => {
		let objZaSlanje = {};
		const pap = 'server api';
		const base = 'server api';
		let time = this.state.duration * this.state.played; 
		const videoUrl = this.state.url

		const data = new FormData();

		const {x, y, width, height} = this.croppInstance.getValue();
		console.log(x, y, width, height);
		this.setState({cw: width, ch: height, cx: x, cy: y})
		data.append('input_url', videoUrl);
		// data.append('size', '160x120');
		data.append('times', time);
		data.append('cw', this.state.cw)
		data.append('ch', this.state.ch)
		data.append('cx', this.state.cx)
		data.append('cy', this.state.cy)

		objZaSlanje.cw = this.state.cw;
		objZaSlanje.ch = this.state.ch;
		objZaSlanje.cx = this.state.cx;
		objZaSlanje.cy = this.state.cy;
		objZaSlanje.time = time;
		objZaSlanje.inputUrl = videoUrl;

		console.log('podatci koje saljem', objZaSlanje);
		//TODO: spremi u state payload informaciju
		this.loading();
		var self = this;
		const payload = axios.post(pap, data).then(function(response) {
			const thumb = response.data.outputs[0].out_path_url + '?' + (new Date().getTime());
			console.log(response.data.outputs[0].out_path_url);
			console.log(response.data.outputs[0].grab_success);
			console.log(response.data.outputs[0].optimize_success);
			self.setState({thumb});
		}).catch(function(err) {console.log(err)})
	}
	getData = () => {
		let croppr = this.croppInstance;
		console.log(croppr);
	}
	handleThumb = () => {
		//ovdje se na klik podese vrijednosti koje saljem serveru
		const {x, y, width, height} = this.croppInstance.getValue();
		console.log(x, y, width, height);
		this.setState({cw: width, ch: height, cx: x, cy: y})
		console.log('from handleThumb values from croppr', this.croppInstance.getValue());
	}
	componentDidMount() {
		this.croppInstance = new Croppr("#croppr", {});
		// this is player element html not to be mistaken with component
		this.playerEL = document.querySelector('.react-player');
		this.cont = document.querySelector('#cont');

	}
	render () {
		const {
			url, playing, volume,
			played, loaded, duration,
			playbackRate,
			fileConfig
		} = this.state

		return (
			<div className='app'>
			<section className='section'>
			<ul>
			<li>
			<Link to="/" >Hosted Version</Link>
			</li>
			</ul>
			<h1>Plejer Sa seekovanjem</h1>

			<input ref={input => { this.urlInput = input }
			} type='text' placeholder='Enter URL' />
			<button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
			<canvas ref={canvas => this.canvas = canvas}></canvas>
			<div id='cont' onClick={() => this.handleThumb()}>

			<ReactPlayer
			ref={player => { this.player = player }}
			className='react-player'
			width={640}
			height={360}
			url={url}
			playing={playing}
			playbackRate={playbackRate}
			volume={volume}
			fileConfig={fileConfig}
			onReady={this.onVideoLoad}
			onStart={() => console.log('onStart')}
			onPlay={() => this.setState({ playing: true })}
			onPause={() => this.setState({ playing: false })}
			onBuffer={() => console.log('onBuffer')}
			onEnded={() => this.setState({ playing: false })}
			onError={e => console.log('onError', e)}
			onProgress={this.onProgress}
			onDuration={duration => this.setState({ duration })}
			/>
			<img id='croppr' src={this.state.src} />
			</div>

			<h4>Cropped Image</h4>
				<ShowThumbs imgUrl={this.state.thumb} /> 
			<br/>
			<table><tbody>
			<tr>
			<th>Controls</th>
			<td>
			<button onClick={this.stop}>Stop</button>
			{this.renderLoadButton('http://video.blendertestbuilds.de/download.blender.org/peach/trailer_480p.mov', 'BigBunny')}

				<button className='play' onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
				<button onClick={this.getData}>GetData</button> 
				<button onClick={this.snap}>Snap Server</button>
				<button onClick={this.cropCanvas}>CanvasSnap</button>
				</td>
				</tr>
				<tr>
				<th>Seek</th>
				<td>
				<input
				type='range' min={0} max={1} step={0.001}
				value={played}
				onMouseDown={this.onSeekMouseDown}
				onChange={this.onSeekChange}
				onMouseUp={this.onSeekMouseUp}
				/>
				</td>
				</tr>
				<tr>
				<th>Volume</th>
				<td>
				<input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
				</td>
				</tr>
				<tr>
				<th>Played</th>
				<td><progress max={1} value={played} /></td>
				</tr>
				<tr>
				<th>Loaded</th>
				<td><progress max={1} value={loaded} /></td>
				</tr>
				</tbody></table>
				</section>
				<br/>
				<section className='section'>

				<h2>State</h2>

				<table><tbody>
				<tr>
				<th>url</th>
				<td className={!url ? 'faded' : ''}>{url || 'null'}</td>
				</tr>
				<tr>
				<th>playing</th>
				<td>{playing ? 'true' : 'false'}</td>
				</tr>
				<tr>
				<th>volume</th>
				<td>{volume.toFixed(3)}</td>
				</tr>
				<tr>
				<th>played</th>
				<td>{played.toFixed(3)}</td>
				</tr>
				<tr>
				<th>loaded</th>
				<td>{loaded.toFixed(3)}</td>
				</tr>
				<tr>
				<th>duration</th>
				<td><Duration seconds={duration} /></td>
				</tr>
				<tr>
				<th>elapsed</th>
				<td><Duration seconds={duration * played} /></td>
				</tr>
				<tr>
				<th>remaining</th>
				<td><Duration seconds={duration * (1 - played)} /></td>
				</tr>
				</tbody></table>
				</section>
				</div>
			)
			}
	}
