const _ = require('lodash');
const dominoBox = require('./dominoBox');

const showBoard = (playerA, playerB, dominoBox, gameTable) => {
	console.log('Player A:');
	console.log(playerA);
	console.log('Player B:');
	console.log(playerB);
	console.log('DominoBox:');
	console.log(dominoBox);
	console.log('Table:');
	console.log(gameTable);
};

const randomShuffle = (dominoBox) => Math.floor(Math.random() * dominoBox.length);

const distributeTiles = (dominoBox, playerA, playerB) => {
	// Distribute tiles to players
	for (let i = 0; i < 7; i++) {
		// Assign one tile to player A
		playerA.push(dominoBox.splice(randomShuffle(dominoBox), 1)[0]);
		// Assign one tile to player B
		playerB.push(dominoBox.splice(randomShuffle(dominoBox), 1)[0]);
	}
};

const isGameOver = (player) => {
	if (player.length === 0) {
		return true;
	}
};

const playTileOnSide = (tileToPlay, gameTable, playerHand) => {
	const tilePosition = playerHand.indexOf(tileToPlay);
	// Check if we can play on the left
	const tableTileLeft = gameTable[0][0];

	const tableTileRight = gameTable[gameTable.length - 1][0];

	if (tileToPlay[0] === tableTileLeft || tileToPlay[1] === tableTileLeft) {
		// Reverse the played tile if needed
		if (tileToPlay[1] !== tableTileLeft) {
			tileToPlay.reverse();
		}
		gameTable.unshift(tileToPlay);
		playerHand.splice(tilePosition, 1);
		return true;
		// Check if we can play on the right
	} else if (tileToPlay[0] === tableTileRight || tileToPlay[1] === tableTileRight) {
		gameTable.push(tileToPlay);
		playerHand.splice(tilePosition, 1);
		return true;
	}
	return false;
};

const makeAMove = (playerHand, dominoBox, gameTable) => {
	let hasTileBeenPlayed = false;

	for (let i = 0; i < playerHand.length; i++) {
		// Select a tile
		const tileToPlay = playerHand[i];

		// Check if we can play on a side
		if (gameTable.length === 0) {
			gameTable.unshift(tileToPlay);
			playerHand.splice(i, 1);
			hasTileBeenPlayed = true;
			return;
		}

		hasTileBeenPlayed = playTileOnSide(tileToPlay, gameTable, playerHand);
	}
	// Fetch and play from dominoBox until you can play
	while (!hasTileBeenPlayed) {
		if (dominoBox.length === 0) {
			return;
		}
		const fetchedTileFromDominoBox = dominoBox.splice(dominoBox.length - 1, 1)[0];
		playerHand.push(fetchedTileFromDominoBox);
		hasTileBeenPlayed = playTileOnSide(fetchedTileFromDominoBox, gameTable, playerHand);
	}
};

const showTheWinner = (playerA, playerB) => {
	if (playerA.length === 0) {
		console.log('Player A has won the game');
	} else if (playerB.length === 0) {
		{
			console.log('Player B has won the game');
		}
	} else {
		const totalHandPlayerA = playerA.reduce((acc, curr) => acc + curr[0] + curr[1], 0);
		const totalHandPlayerB = playerB.reduce((acc, curr) => acc + curr[0] + curr[1], 0);

		if (totalHandPlayerA < totalHandPlayerB) {
			console.log('Player A has won the game');
		} else if (totalHandPlayerA > totalHandPlayerB) {
			console.log('Player B has won the game');
		} else {
			console.log('Both players have the same total of points');
		}
	}
};

function startGame() {
	// Init variables
	dominoBox;
	const playerA = [];
	const playerB = [];
	const gameTable = [];
	let previousPlayerA;
	let previousPlayerB;
	// Distribute tiles
	distributeTiles(dominoBox, playerA, playerB);

	showBoard(playerA, playerB, dominoBox, gameTable);

	// While no winner
	let noOneHasWon = true;
	while (noOneHasWon) {
		// Check if game is not over
		if (isGameOver(playerA)) {
			break;
		}
		// Player A plays
		makeAMove(playerA, dominoBox, gameTable);
		// Check if game is not over
		if (isGameOver(playerB)) {
			break;
		}
		// Player B plays
		makeAMove(playerB, dominoBox, gameTable);

		showBoard(playerA, playerB, dominoBox, gameTable);

		// Check if game is blocked
		if (_.isEqual(playerA, previousPlayerA) || _.isEqual(playerB, previousPlayerB)) {
			console.log('Blocked');
			break;
		} else {
			previousPlayerA = [ ...playerA ];
			previousPlayerB = [ ...playerB ];
		}
	}
	// Show the winner
	showTheWinner(playerA, playerB);
}

startGame();
