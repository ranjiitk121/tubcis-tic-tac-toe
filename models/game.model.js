const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  moves: [
    {
      type: String,
      default: '',
    },
  ],
  username1: {
    type: 'String',
    required: true,
  },
  username2: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    defult: false,
  },
  isTied: {
    type: Boolean,
    default: false,
  },
  currentPlayer: {
    type: String,
    default: 'O', // inital by player one
  },
  winner: {
    type: String,
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
