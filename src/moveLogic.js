import {map2, subjectCount2, subjects2} from './levels/map2';
import Modal from './modal/modalPlugin.js';
import './modal/modalPlugin.css';

function _logic(x, y, protagonist, _this) {
	let cellToMove = document.querySelector(`div[data-xy='${x}.${y}']`)
	let cell = _this.map[x][y];
	let textBox = document.querySelector('#text')
	
	function _levelUp() {
		if (_this.state.protagonist.exp >= _this.state.protagonist.nextLevel) {
			_this.state.protagonist.weapon *= 1.3;
			_this.state.protagonist.life += 30;
			_this.state.protagonist.nextLevel += 100;
			_this.state.protagonist.hitDamage();
			textBox.innerHTML += '<p>Level up!<br>Damage *1.3, Life +30!</p>';
		}
	}

	if (!cell) {
		cellToMove.className = 'cell protagonist';
		protagonist.className = 'cell false';
		_this.state.protagonist.x = x;
		_this.state.protagonist.y = y;
	}
	else if (cell.type === 'shroom') {
		if (Math.random() < 0.5) {
			textBox.innerHTML = '<p>Found a nice looking mushroom!<br> Ugh... some bad trip,<br>Life -20, Exp +50</p>';
			_this.state.protagonist.life -= 20;
		} else {
			textBox.innerHTML = '<p>Found a nice looking mushroom!<br> Some mellow shrooms right there... Life +20, Exp +50</p>';
			_this.state.protagonist.life += 20;
		}
		cellToMove.className = 'cell false';
		_this.map[x][y] = 0;
		_this.state.protagonist.exp += 50;
		_this.state.shrooms -= 1;
		_levelUp();
	}
	else if (cell.type === 'weapon') {
		_this.state.protagonist.weapon *= 1.5;
		_this.state.weapons -= 1;
		_this.state.protagonist.hitDamage();
		textBox.innerHTML = `<p>Found ${cell.type}, damage increased by *1.5</p>`;
		cellToMove.className = 'cell false';
		_this.map[x][y] = 0;
	}
	else if (cell.type === 'potion') {
		_this.state.protagonist.life += cell.strength;
		textBox.innerHTML = `<p>Found a heart. Life +${cell.strength}!</p>`;
		cellToMove.className = 'cell false';
		_this.map[x][y] = 0;
		_this.state.potions -= 1;
	}
	else if (cell.type === 'enemy') {
		let damage = _this.state.protagonist.hitDamage();
		cell.life -= damage;
		if (cell.life <= 0) {
			textBox.innerHTML = `<p>You attacked with ${damage} damage and killed the monster. Exp +20</p>`;
			cellToMove.className = 'cell false';
			_this.map[x][y] = 0;
			_this.state.protagonist.exp += 20;
			_this.state.enemies -= 1;
			_levelUp();
		} else {
				let monsterDamage = cell.hitDamage();
				_this.state.protagonist.life -= monsterDamage;
				if (_this.state.protagonist.life <= 40) {
					textBox.innerHTML = `You're dead! You miserably failed in your perilous adventure.`;
										
					let modal = new Modal({
						backgroundColor: 'rgb(41,41,41)',
						content: `Game over!<br>Want to play again?<br><br>
						<button type="button">Yes!</button><br><br>
						 If not, you may continue to move around the map, but be warned: There be dragons(bugs) here now!`
					})
					modal.show();
					document.querySelector('.modal-overlay button').onclick = () => {
						modal.close();
						_this.resetGameMap();
					}
				} else {
					textBox.innerHTML = `<p>You attack ${cell.type} with ${damage} damage!<br/> Monster has ${cell.life} hp left.</br> Monster hit with ${monsterDamage} damage!</p>`;
				}
		}
	}
	else if (cell.type === 'beer') {
		
		let modal = new Modal({
			backgroundColor: 'rgb(41,41,41)',
			content: `Are you ready to drink the beer, pass out and wake up in a new level?<br><br>
			<button type="button" id="yes">Yes!</button>&nbsp;&nbsp;&nbsp;
			<button type="button" id="no">No!</button>`
		})
		modal.show();
		document.querySelector('.modal-overlay #yes').onclick = () => {
			modal.close();
			let nextLevel = _this.level + 1;
			textBox.innerHTML = `<p>Beer, sweet beer... You suddenly wake up in level #${nextLevel}</p>`;
			switch(nextLevel) {
				case 2:
//map = map1, subjects = subjects1, subjectCount = subjectCount1, level = 1
					_this.resetGameMap(map2, subjects2, subjectCount2, nextLevel);
					break;
				// case 3:
					// _this.map = map3;
					// subjectCount = subjectCount3;
					// break;
				default:
					_this.resetGameMap();
					break;
			}
		}
		document.querySelector('.modal-overlay #no').onclick = () => {
			modal.close()
			textBox.innerHTML = '<p>No time for beer just yet!</p>';
			return;
		}
	}
	_this.setState({
		protagonist: _this.state.protagonist,
		enemies: _this.state.enemies,
		shrooms: _this.state.shrooms,
		potions: _this.state.potions
	})
}

export default function _moveLogic(event) {
	event.preventDefault();
	let protagonist = document.querySelector('.protagonist');
	let XY = protagonist.dataset.xy.split('.');
	let x,y;
	
	switch(event.key) {
		case 'ArrowUp':
			x = XY[0] - 1;
			y = XY[1];
			_logic(x, y, protagonist, this);
			break;
		case 'ArrowDown':
			x = +XY[0] + 1;
			y = XY[1];
		_logic(x, y, protagonist, this);
			break;
		case 'ArrowLeft':
			x = XY[0];
			y = XY[1] - 1;
			_logic(x, y, protagonist, this);
			break;
		case 'ArrowRight':
			x = XY[0];
			y = +XY[1] + 1;
			_logic(x, y, protagonist, this);
			break;
		default:
			console.log('Use arrow keys, you dummy.');
		break;
	}
}
