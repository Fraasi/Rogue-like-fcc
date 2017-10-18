import React, { Component } from 'react';
import './App.css';
import Cell from './Cell';
import fillMap from './fillMap';
import Stats from './Stats';
import _moveLogic from './moveLogic';
import {map1, subjects1, subjectCount1} from './levels/map1';
import Subject from './Subject';

class App extends Component {
	constructor() {
		super()
			this.state = {
				weapons: 0,
				shrooms: 0,
				potions: 0,
				enemies: 0,
				darkness: false,
				protagonist: new Subject('protagonist', 50, 10, 10, 10)
			};
			
			this.map = this._copy2DArr(map1);
			this.subjects = subjects1;
			this.level = 1;
			this.height = 400;
			this.width = 400;
			this.rows = Math.floor(this.height / 20);
			this.cols = Math.floor(this.width / 20);
	}

	componentDidMount() {
		this.resetGameMap();
		document.addEventListener('keydown', _moveLogic.bind(this));
	}
	
	_calculateDist(x, y, x2, y2) {
		return Math.pow( Math.pow((x - x2), 2) + Math.pow((y - y2), 2), 0.5 )
	}
	
	_copy2DArr(arr, copyArr = []) {
		for (let subArr of arr) {
			copyArr.push([...subArr])
		}
		return copyArr;
	};
	
	toggleDarkness() {
		this.setState({ darkness: !this.state.darkness })  
	}
	
	resetGameMap(map = map1, subjects = subjects1, subjectCount = subjectCount1, level = 1) {
	//still doesnt show items before move
		//find & delete all subjects from dom
		document.querySelectorAll('.App > div:not(.true):not(.false)').forEach( sub => sub.className = 'cell false');
		
		this.map = this._copy2DArr(map);
		this.subjects = Array.from(subjects);
		this.level = level;
		this.setState({
				weapons: subjectCount.weapon,
				shrooms: subjectCount.shroom,
				potions: subjectCount.potion,
				enemies: subjectCount.enemy,
				darkness: true,
				protagonist: this.state.protagonist.life >= 0 ? this.state.protagonist : new Subject('protagonist', 50, 10, 10, 10) 
		}, fillMap.bind(this, this.map, this.subjects))

		document.querySelector(`div[data-xy='${10}.${10}']`).className = 'cell protagonist';
		document.querySelector(`div[data-xy='${10}.${9}']`).className = 'cell beer'; // otherwise not showing on start
	}
	
  render() {
		let cellMap = [];

		this.map.forEach( (subArr, x) => {
			subArr.forEach( (cell, y) => {
				let key = `${x}.${y}`;
				let cellClass;
								
				switch(cell) {
					case 1:
						cellClass = 'true';
					break;
					case 0:
						cellClass = 'false';
						break;
					default:
						cellClass = cell.type;
						break;
				}

				if (this.state.darkness) {
					let dist = this._calculateDist(this.state.protagonist.x, this.state.protagonist.y, x, y);	
					if (this.state.darkness && dist > 4) {
						if (dist >  5) cellClass += ' darkness';
						else cellClass += ' halfdarkness';
					}
				}
				
				cellMap.push(
					<Cell
						key={key}
						cellClass={cellClass}
						x={x}
						y={y}
					/>
				);
			})
		})

    return (
			<div id='shadow'>
				<div id='title'>&emsp;&emsp; Rogue like FCC challenge</div>
				<div className="App" style={{width:`${this.height}px`, height:`${this.width}px`}}>
					{cellMap}
				</div>
				<Stats 
					state={this.state}
					toggleDarkness={this.toggleDarkness.bind(this)}
				/>
			</div>
    );
  }
}

export default App;