import React, { Component } from 'react';
import './Cell.css';


class Cell extends Component{
	render() {
		return (
			<div
				className={'cell ' + this.props.cellClass}
				data-xy={`${this.props.x}.${this.props.y}`}
			/>
		)
	}
}

export default Cell;