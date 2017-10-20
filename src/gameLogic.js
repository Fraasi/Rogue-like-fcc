import {map2, subjectCount2, subjects2} from './levels/map2';
import {map3, subjectCount3, subjects3} from './levels/map3';
import {map4, subjectCount4, subjects4} from './levels/map4';
import Modal from './modal/modalPlugin.js';
import './modal/modalPlugin.css';

const beasts = ['beast', 'foul beast', 'sack of bones', 'enemy', 'skull thingy','poor creature', 'pixels next to you', 'evil monster', 'monster'];

function IfDead(_this, textBox, mush) {
	textBox.innerHTML = `You're dead! You miserably failed in your perilous adventure.${mush ? '.. to a mushroom.' : ''}`;
			
	if (document.querySelector('.modal-overlay') === null) {
		let modal = new Modal({
			backgroundColor: 'rgb(41,41,41)',
			content: `Game over!<br>Want to play again?<br><br>
			<button type="button">Yes!</button><br><br>
			 If not, you may continue to move around the map, but be warned: There be dragons(bugs) here now!`
		})
		modal.show();
		document.querySelector('.modal-overlay button').onclick = () => {
			modal.close();
			document.querySelector('#cheats').style.opacity = 0;
			_this.resetGameMap();
		}
	}
}


function _logic(x, y, _this) {
	let cell = _this.state.map[x][y];
	const textBox = document.querySelector('#text');
	
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
		_this.state.map[x][y] = _this.state.map[_this.state.protagonist.x][_this.state.protagonist.y];
		_this.state.map[_this.state.protagonist.x][_this.state.protagonist.y] = 0;
		_this.state.protagonist.x = x;
		_this.state.protagonist.y = y;
	}
	else if (cell.type === 'shroom') {
		if (Math.random() < 0.5) {
			_this.state.protagonist.life -= 20;
			textBox.innerHTML = '<p>Found a nice looking mushroom!<br> Ugh... some bad mojo in this trip... Life -20, Exp +40</p>';
			if (_this.state.protagonist.life <= 0) IfDead(_this, textBox, true);
		} else {
			_this.state.protagonist.life += 20;
			textBox.innerHTML = '<p>Found a nice looking mushroom!<br> Some mellow shrooms right there... Life +20, Exp +40</p>';
		}
		_this.state.map[x][y] = 0;
		_this.state.protagonist.exp += 40;
		_this.state.shrooms -= 1;
		_levelUp();
	}
	else if (cell.type === 'weapon') {
		_this.state.protagonist.weapon *= 1.3;
		_this.state.weapons -= 1;
		_this.state.protagonist.hitDamage();
		_this.state.map[x][y] = 0;
		textBox.innerHTML = `<p>Found ${cell.type}, damage increased by *1.3</p>`;
	}
	else if (cell.type === 'potion') {
		_this.state.protagonist.life += cell.strength;
		_this.state.map[x][y] = 0;
		_this.state.potions -= 1;
		textBox.innerHTML = `<p>Found a heart. Life +${cell.strength}!</p>`;
	}
	else if (cell.type === 'enemy') {
		let damage = _this.state.protagonist.hitDamage();
		let monster = beasts[Math.floor(Math.random() * beasts.length)];
		cell.life -= damage;
		if (cell.life <= 0) {
			_this.state.map[x][y] = 0;
			_this.state.protagonist.exp += 20;
			_this.state.enemies -= 1;
			textBox.innerHTML = `<p>You attacked with ${damage} damage and killed the ${monster}. Exp +20</p>`;
			_levelUp();
		} else {
			let monsterDamage = cell.hitDamage();
			_this.state.protagonist.life -= monsterDamage;
			if (_this.state.protagonist.life <= 0) {
				IfDead(_this, textBox);
			} else {
				textBox.innerHTML = `<p>You attack the ${monster} with ${damage} damage!<br/>It has ${cell.life} hp left.</br>The ${monster} takes revenge with ${monsterDamage} damage!</p>`;
			}
		}
	}
	else if (cell.type === 'beer') {
		if (document.querySelector('.modal-overlay') === null) {
			let modal = new Modal({
				backgroundColor: 'rgb(41,41,41)',
				content: `Are you ready to drink the beer, pass out and wake up in a new level?<br><br>
				<button type="button" id="yes">Yes!</button>&nbsp;&nbsp;&nbsp;
				<button type="button" id="no">No!</button><br><br>
				(or enter to enter nextlevel)`
			})
			modal.show();

			const yesEnter = function() {
				document.removeEventListener('keydown', enter);
				modal.close();
				let nextLevel = _this.level + 1;
				textBox.innerHTML = `<p>Beer, sweet beer... You suddenly find yourself in level #${nextLevel} and have no idea how you got here.</p>`;
				switch(nextLevel) {
					case 2:
						_this.state.protagonist.x = 10;
						_this.state.protagonist.y = 10;
						_this.resetGameMap(map2, subjects2, subjectCount2, nextLevel);
						break;
					case 3:
						_this.state.protagonist.x = 10;
						_this.state.protagonist.y = 10;
						_this.resetGameMap(map3, subjects3, subjectCount3, nextLevel);
						break;
					case 4:
						_this.state.protagonist.x = 10;
						_this.state.protagonist.y = 10;
						_this.resetGameMap(map4, subjects4, subjectCount4, nextLevel);
						break;
					default:
						_this.state.protagonist.x = 10;
						_this.state.protagonist.y = 10;
						_this.resetGameMap();
						break;
				}
				document.querySelector('#cheats').style.opacity = 0;
			}
			
			document.querySelector('.modal-overlay #no').onclick = () => {
				modal.close()
				textBox.innerHTML = '<p>No time for beer just yet!</p>';
				return;
			}
			document.querySelector('.modal-overlay #yes').onclick = yesEnter;
			function enter(e) {
				if (e.key === 'Enter') {
					yesEnter();
				}
			}
			document.addEventListener('keydown', enter);
		}
	}
	
	_this.setState({
		protagonist: _this.state.protagonist,
		enemies: _this.state.enemies,
		shrooms: _this.state.shrooms,
		potions: _this.state.potions,
		map: _this.state.map
	})
}

export default function _gameLogic(event) {
	event.preventDefault();
	
	let x = this.state.protagonist.x;
	let y = this.state.protagonist.y;
	
	switch(event.key) {
		case 'ArrowUp':
			_logic(x-1, y, this);
			break;
		case 'ArrowDown':
		_logic(x+1, y, this);
			break;
		case 'ArrowLeft':
			_logic(x, y-1, this);
			break;
		case 'ArrowRight':
			_logic(x, y+1, this);
			break;
		default:
			console.log('Use arrow keys, you dummy.', event.key);
		break;
	}
}
