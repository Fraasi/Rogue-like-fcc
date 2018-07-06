class Buttons extends React.Component {
	render() {
		return (
			<div className="buttons">
				<button type="button"
					onClick={this.props.playPause} >
					{this.props.runButtonText}
				</button>
				<button type="button"
					onClick={this.props.changeSpeed} >
					{this.props.speedButtonText}
				</button>
				<button type="button"
					onClick={this.props.randomGrid} >
					Random grid
				</button>
				<button type="button"
					onClick={this.props.clearGrid} >
					Clear grid
				</button>
			</div>
		)
	}
}

class StatsAndSave extends React.Component {	
	render() {
		return (
			<div className={'statsAndSave'}>
				<button type="button"
					onClick={this.props.saveBins} >
					Save grid
				</button>
				<span className="stats">
					Generation: {this.props.generations} &nbsp;
					Cells alive: {this.props.cellsAlive}
				</span>
				<button type="button"
					onClick={this.props.loadBins} >
					{ this.props.savedAlive > 0 ? 'Load grid' : 'No save' }
				</button>
			</div>
		)
	}
}

class Cell extends React.Component {

	_handleClick = () => {
		console.log(this.props.y, this.props.x);
		this.props.handleCellClick(this.props.y, this.props.x);
	};
	
	render() {
		return (
			<div
				className={this.props.cellClass}
				onClick={this._handleClick}
			/>
		)
	}
}

class Grid extends React.Component {
	
	render() {
		let cellArr = [];
		this.props.bins.forEach( (col, y) => {
			col.forEach( (cell, x) => {
				let key = `${y}.${x}`;
				let cellClass = this.props.bins[y][x] ? 'cell true' : 'cell false';
				cellArr.push(
					<Cell
						key={key}
						cellClass={cellClass}
						y={y}
						x={x}
						handleCellClick={this.props.handleCellClick}
					/>
				)
			})
		})
	
		return (
			<div 
				id={'grid'}
				style={{height: this.props.height+'px', width: this.props.width+'px'}}>
				{cellArr}
			</div>
		)
	}
}

class Gol extends React.Component {
	constructor() {
		super();
		this.state = {
			bins: [],
			generations: 0,
			alive: 0,
			speed: 150,
			speedButtonText: 'Slower',
			runButtonText: 'Run',
			running: false
		};
		this.savedBins = [];
		this.savedAlive = 0;
		this.height = 400;
		this.width = 400;
		this.rows = Math.floor(this.height / 20);
		this.cols = Math.floor(this.width / 20);
	};

	componentDidMount() {
		this.randomGrid();
	};
	
	randomGrid = () => {
		let alive = 0;
		let bins = Array(this.rows).fill().map(() => {
				return Array(this.cols).fill().map( () => {
					let r = Math.random() > 0.6 ? 1 : 0;
					if (r) alive++;
					return r;
				})
			});
			
			for(let x=9;x<13;x++){
				for(let y=0;y<this.rows;y++){
					bins[y][x] = 0;
				}
			}

			for(let x=0;x<this.cols;x++){
				for(let y=0;y<this.rows;y++){
					
					if (x === 0 || x === 19) bins[x][y] = 1;
					if (y === 0 || y === 19) bins[x][y] = 1;
	

				}
			}
			
		this.setState({
			bins: bins,
			generations: 0,
			alive: alive,
			running: false,
			runButtonText: 'Run'
		}, this._interval)
	};
	
	handleCellClick = (y, x) => {
		let tempArr = [].concat(this.state.bins);
		tempArr[y][x] = !tempArr[y][x];
		this.setState({
			bins: tempArr,
			alive: tempArr[y][x] ? this.state.alive + 1 : this.state.alive - 1
		})
	};

	playPause = () => {
		this._run();
		// if (this.state.running) {		
			// this.setState({
				// running: false,
				// runButtonText: 'Run'
			// }, this._interval)
		// } else {
			// this.setState({
				// running: true,
				// runButtonText: 'Pause'
			// }, this._interval)
		// }
	};
	
	clearGrid = () => {	
		this.setState({
			bins: Array(this.rows).fill().map(() => Array(this.cols).fill(0)),
			generations: 0,
			alive: 0,
			running: false,
			runButtonText: 'Run',
		}, this._interval)
	};
	
	changeSpeed = () => {
		
		if (this.state.speed === 150) {
			this.setState({
				speed: 500,
				speedButtonText: 'Faster'
			}, this._interval)
		} else {
			this.setState({
				speed: 150,
				speedButtonText: 'Slower'
			}, this._interval)
		}
	};
	
	saveBins = () => {
		console.log(this.state.bins);
		// let print = [];
		
			// for(let x=0;x<this.cols;x++){
				// for(let y=0;y<this.rows;y++){
					// print.push(this.state.bins[x][y])
				// }
			// }
		// console.log('print ', print);
		
		
		this.savedBins = this._copyArr(this.state.bins);
		this.savedAlive = this.state.alive;
		// this.setState({
			// running: false,
			// runButtonText: 'Run',
		// }, this._interval)
	};
	
	loadBins = () => {
		if (this.savedAlive > 0) {
			this.setState({
				bins: this._copyArr(this.savedBins),
				generations: 0,
				alive: this.savedAlive,
				running: false,
				runButtonText: 'Run'
			}, this._interval)
		}
	};
	
	_copyArr(arr, copyArr = []) {
		for (let subArr of arr) {
			copyArr.push([...subArr])
		}
		return copyArr;
	};
	
	_interval() {
		clearInterval(this.interval);
		if (this.state.running)	this.interval = setInterval(this._run, this.state.speed);
	};
	
	_run = () => {
	
		function _mod(x, m) {			
			// m = Math.abs(m);
			return (x % m + m) % m;
		}

		let nextGenBins = [];
		let aliveCount = 0;
		
		this.state.bins.forEach( (row, y, arr) => {
			nextGenBins[y] = [];
			row.forEach( (cell, x) => {
				let neighbours = 0;
				if (arr[_mod(y-1, this.rows)][_mod(x-1, this.cols)]) neighbours++;
				if (arr[_mod(y-1, this.rows)][x]) neighbours++;
				if (arr[_mod(y-1, this.rows)][_mod(x+1, this.cols)]) neighbours++;
				if (arr[y][_mod(x-1, this.cols)]) neighbours++;
				if (arr[y][_mod(x+1, this.cols)]) neighbours++;
				if (arr[_mod(y+1, this.rows)][_mod(x-1, this.cols)]) neighbours++;
				if (arr[_mod(y+1, this.rows)][x]) neighbours++;
				if (arr[_mod(y+1, this.rows)][_mod(x+1, this.cols)]) neighbours++;

				let temp = cell;
				
				if (cell == 1 && neighbours >= 4) temp = 1;
				else if (cell == 0 && neighbours >= 5) temp = 1;
				
				nextGenBins[y][x] = temp;
				if (temp === 1) aliveCount++;
			})
		})

		this.setState({
			bins: nextGenBins,
			generations: this.state.generations + 1,
			alive: aliveCount
		})
		
		if (aliveCount  === 0) {
			this.setState({
				running: false,
				runButtonText: 'Run'
			}, this._interval)
		}
	};
	
	render() {	
		return (
			<div className="wrapper">
				<h3>Conway's Game of Life</h3>
				<Buttons 
					randomGrid={this.randomGrid}
					clearGrid={this.clearGrid}
					changeSpeed={this.changeSpeed}
					speedButtonText={this.state.speedButtonText}
					playPause={this.playPause}
					runButtonText={this.state.runButtonText}
				/>
				<Grid
					bins={this.state.bins}
					height={this.height}
					width={this.width}
					rows={this.rows}
					cols={this.cols}
					handleCellClick={this.handleCellClick}
				/>
				<StatsAndSave
					savedAlive={this.savedAlive}
					saveBins={this.saveBins}
					loadBins={this.loadBins}
					generations={this.state.generations} 
					cellsAlive={this.state.alive}
				/>
			</div>
		)
	}
}

ReactDOM.render(
	<Gol />,
	document.getElementById('root')
)