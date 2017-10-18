import Subject from './Subject';

function _fillMap(map, subjects) {
	
	//acceptable free tiles
	let freeTiles = [];
	map.forEach( (cols, x) => {
		cols.forEach( (cell, y) => {
			if (map[x][y] === 0) {
				if((x<8 || x>13) && (y<8 || y>13)) {
					freeTiles.push([x,y]);
				}
			}
		})
	})

	//put subjects in places, (type, glyph, maxLife, strength, x, y)
	do {
		let rTile = Math.floor(Math.random() * freeTiles.length);
		let rSubject = Math.floor(Math.random() * subjects.length);
 
		if (subjects[rSubject] === 'enemy') {
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('enemy', 'E', 50, 5);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1);
		}
		else if (subjects[rSubject] === 'potion') {
			let strength = Math.floor(Math.random() * (20-10+1)+10);
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('potion', '🍾', 10, strength);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1)
		}
		else if (subjects[rSubject] === 'weapon') {
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('weapon', 'W', 10);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1)
		}
		else if (subjects[rSubject] === 'item') {
			map[freeTiles[rTile][0]][freeTiles[rTile][1]] = new Subject('item', 'T', 10);
			subjects.splice(rSubject, 1);
			freeTiles.splice(rTile, 1)
		}
	}
	while (subjects.length > 0)
		
	map[10][9] = new Subject('ladder');
}

export {_fillMap};