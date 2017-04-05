import React, { Component } from 'react';

class ShowThumbs extends Component {
	render() {
		const { imgUrl } = this.props;
		return(<img src={imgUrl} width='200px' height='150px' />)
	}
}

export default ShowThumbs;
