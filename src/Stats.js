import React, { Component } from 'react';
import './stats.css';

class Stats extends Component {
	
	toggleCheat() {
		let div = document.getElementById('cheats');
		if (div.style.opacity === '0') div.style.opacity = '1';
		else div.style.opacity = '0';
	}

	render() {
		return (
			<div id="statsdiv">
				<div id='stats'>
					Life: {this.props.state.protagonist.life} <br/>
					Attack: {this.props.state.protagonist.maxMinD}<br/>
					Exp: {this.props.state.protagonist.exp} / {this.props.state.protagonist.nextLevel} <br/><br/>
					<button id='cheatButton' onClick={this.toggleCheat} >Cheat</button>
				</div><br/>
				<div id='cheats' style={{opacity: 0}}>
					Items left in map: <br />
					Shrooms: {this.props.state.shrooms} <br/>
					Weapons: {this.props.state.weapons} <br/>
					Hearts: {this.props.state.potions} <br/>
					Enemies: {this.props.state.enemies} <br/><br/>
					<button id='toggleButton' onClick={this.props.toggleDarkness} >Toggle darkness</button>
				</div>
				<div id='text'>
					<p>Arrow keys to move.<br />Find items, kill monsters. Drink beer for next level.<br /> Boss is in level #4</p>
				</div>
			</div>
		)
	}
}

export default Stats;