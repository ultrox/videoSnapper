import React from 'react'
import ReactDOM from 'react-dom'
import {Router, browserHistory, Route} from 'react-router';
import "./resources/custom.css"
import 'croppr/dist/croppr.css';
import 'cropperjs/dist/cropper.css';
import Canvas from './Canvas.js'

const routes = (
	<Router history={browserHistory}>
		<Route path="/" component={Canvas} />
		{/* <Route path="/remote" component={App} /> */}
	</Router>
)
ReactDOM.render(routes, document.getElementById('app'))
