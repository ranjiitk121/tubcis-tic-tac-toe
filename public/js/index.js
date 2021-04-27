const gameboard = document.getElementById('gameboard');
const boxes = Array.from(document.getElementsByClassName('box'));
const restartBtn = document.getElementById('restartBtn');
let gameId = null;
const playText = document.getElementById('playText');
const spaces = [null, null, null, null, null, null, null, null, null];
const O_TEXT = 'O';
const X_TEXT = 'X';
let currentPlayer = O_TEXT;

const drawBoard = () => {
  boxes.forEach((box, index) => {
    let styleString = '';
    if (index < 3) {
      styleString += `border-bottom: 3px solid var(--purple);`;
    }
    if (index % 3 === 0) {
      styleString += `border-right: 3px solid var(--purple);`;
    }
    if (index % 3 === 2) {
      styleString += `border-left: 3px solid var(--purple);`;
    }
    if (index > 5) {
      styleString += `border-top: 3px solid var(--purple);`;
    }
    box.style = styleString;

    box.addEventListener('click', boxClicked);
  });
};

function boxClicked(e) {
  const id = e.target.id;
  if (!spaces[id]) {
    spaces[id] = currentPlayer;
    e.target.innerText = currentPlayer;
    // send request to server
    if (gameId) {
      playText.innerHTML = 'Please wait, we are making API Call';
      boxes.forEach((box) => {
        // set visibility to hidden
        box.style.display = 'none';
      });
      postData('https://lit-retreat-32140.herokuapp.com/games/move', {
        gameId,
        positionOfMove: id,
      }).then((data) => {
        // JSON data parsed by `data.json()` call
        // all boxes disppaer and set text to wating
        // set text to normal after 2 seconsds
        // playText.innerHTML = 'Done making request, you can play now';
        boxes.forEach((box) => {
          // set visibility to hidden
          box.style.display = 'block';
        });

        playText.innerHTML = 'Gaame is On';

        const { game } = data;
        if (data.won) {
          /// won the game
          playText.innerHTML = `${currentPlayer === 'O_TEXT' ? X_TEXT : O_TEXT} wins!!`;
          return;
        }
        if (data.isTied) {
          // game is tied
          playText.innerHTML = 'Game is tied ): Please press restart button';
          gameId = null;
          return;
        }

        currentPlayer = currentPlayer === O_TEXT ? X_TEXT : O_TEXT;
      });
    }
  }
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDg4MTA4ZjBlOGY3MDAwMTViZTJmNzAiLCJpYXQiOjE2MTk1MzcwNzB9.IIPb6m91hMlsBO3LI1tHjvU36DpAaRR8ucIMrk5_Qi8',
      'Content-Type': 'application/json',

      Accept: '*/*',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// make request for creating a game

function makeNewGame() {
  postData('https://lit-retreat-32140.herokuapp.com/games/new', {
    username1: 'O',
    username2: 'x',
  }).then((data) => {
    if (data.game) {
      gameId = data.game._id;

      drawBoard();
    }
  });
}

restartBtn.addEventListener('click', () => {
  window.location.reload();
});

makeNewGame();
