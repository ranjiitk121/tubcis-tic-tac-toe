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
  status: {
    type: String,
  },
  lastMoveBy: {
    type: String,
    default: 'username1',
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
