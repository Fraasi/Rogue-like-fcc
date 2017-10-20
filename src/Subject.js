class Subject {
	constructor(type, life, strength, x, y) {
		this.type = type;
		this.life = life;
		this.weapon = 1;
		this.exp = 0;
		this.nextLevel = 100;
		this.strength = strength;
		this.hitDamage = () => this._damage(this.weapon * this.strength);
		this.x = x;
		this.y = y;
		this.maxMinD = `${Math.floor((this.weapon * this.strength) * 0.8)} - ${Math.floor((this.weapon * this.strength) * 1.2)}`
	}
	
	_damage(d) {
		let min = d * 0.8;
		let max = d * 1.2;
		this.maxMinD = `${Math.floor(min)} - ${Math.floor(max)}`;

		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

export default Subject;