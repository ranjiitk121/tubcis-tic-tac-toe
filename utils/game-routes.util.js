function makeNextMove(game, positionOfMove) {
  if (game.currentPlayer === 'O') {
    game.moves[positionOfMove] = 'O';
    game.currentPlayer = 'X';
  } else {
    game.moves[positionOfMove] = 'X';
    game.currentPlayer = 'O';
  }
  return { moves: game.moves, currentPlayer: game.currentPlayer };
}

function isPositionAlreadyFilled(position) {
  return position !== '' ? true : false;
}

function playerHasWon(moves, newPlayer) {
  let hasPlayerWon = false;
  const currentPlayer = newPlayer === 'X' ? 'O' : 'X';

  if (moves[0] === currentPlayer) {
    if (moves[1] === currentPlayer && moves[2] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on the up top`);
    }
    if (moves[3] === currentPlayer && moves[6] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on the left `);
    }
    if (moves[4] === currentPlayer && moves[8] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on the left `);
    }
  }
  if (moves[8] === currentPlayer) {
    if (moves[2] === currentPlayer && moves[5] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on the rigth`);
    }
    if (moves[6] === currentPlayer && moves[7] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on the bottom `);
    }
  }
  if (moves[4] === currentPlayer) {
    if (moves[1] === currentPlayer && moves[7] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on vertically in the middle`);
    }
    if (moves[3] === currentPlayer && moves[5] === currentPlayer) {
      hasPlayerWon = true;
      console.log(`${currentPlayer} wins on horizentally in the middle`);
    }
  }
  return hasPlayerWon;
}

function isTied(moves) {
  let isTie = true;
  moves.forEach((move) => {
    // this means that there is at least one box or positio that is empty
    if (!move) isTie = false;
  });
  return isTie;
}

module.exports = { isTied, playerHasWon, makeNextMove, isPositionAlreadyFilled };
