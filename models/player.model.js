const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  games: [
    {
      game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Game',
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  playerSymbol: {
    type: String,
    require: true,
  },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
