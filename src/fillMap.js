import Subject from './Subject';

export default function fillMap(map, subjects) {

	//acceptable free tiles
	const freeTiles = [];
	map.forEach( (cols, x) => {
		cols.forEach( (cell, y) => {
			if (map[x][y] === 0) {
				if((x<8 || x>13) && (y<8 || y>13)) {
					freeTiles.push([x,y]);
				}
			}
		})
	})

	//put subjects in place, (type, maxLife, strength, x, y)
	do {
		let rTile = Math.floor(Math.random() * freeTiles.length);
		let rSubject = Math.floor(Math.random() * subjects.length);
 
		if (subjects[rSubject] === 'enemy') {
			let monsterStrength = 5;
			let monsterlife = 50;
			if (this.level === 2) {
				monsterStrength = 10;
				monsterlife = 75;
			}
			if (this.level === 3) {
				monsterStrength = 15;
				monsterlife = 100;
			}
			if (this.level === 4) {
				monsterStrength = 20;
				monsterlife = 150;
			}
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('enemy', monsterlife, monsterStrength);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1);
		}
		else if (subjects[rSubject] === 'potion') {
			let strength = Math.floor(Math.random() * (20-10+1)+10);
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('potion', null, strength);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1)
		}
		else if (subjects[rSubject] === 'weapon') {
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('weapon', null, 1.3);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1)
		}
		else if (subjects[rSubject] === 'shroom') {
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('shroom');
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1)
		}
	}
	while (subjects.length > 0)
		
	map[10][9] = new Subject('beer');
	map[10][10] = this.state.protagonist;
	
	if (this.level === 4) {
		map[8][1] = new Subject('boss', 200, 1);
		map[10][9] = 0;
	}
	this.setState({
		map: map,
		darkness: true
	})
	// console.log('fill', map);
}