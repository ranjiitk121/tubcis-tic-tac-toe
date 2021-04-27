const router = require('express').Router();
const { Types } = require('mongoose');
const Game = require('../models/game.model');
const auth = require('../middilwares/auth');
const { startGameValidatoin } = require('../middilwares/validations');

module.exports = () => {
  router.post('/new', auth, startGameValidatoin, async (req, res) => {
    try {
      const { username1, username2 } = req.body;
      const game = new Game({ username1, username2, status: 'on-going' });
      // initial the game by setting moves array to 9 empty string
      game.moves = ['', '', '', '', '', '', '', '', ''];
      await game.save();
      return res.json({ game, success: true, msg: 'game has started' });
    } catch (err) {
      return res.json({
        error: err,
        success: false,
        msg: "we couldn't start game. please try again",
      });
    }
  });

  router.post('/move', auth, async (req, res) => {
    try {
      //   const gameId = await Types.ObjectId(req.body.gameId);
      const game = await Game.findById(req.body.gameId);
      const { positionOfMove } = req.body;

      if (game.moves.length) {
        // lengt is greater than zeo or not zero, this mean that this is not first move
        const newMovesAndPlayer = makeNextMove(game, positionOfMove);
        game.moves = newMovesAndPlayer.moves;
        game.lastMoveBy = newMovesAndPlayer.lastMoveBy;
        await game.save();
        console.log('new moves ');
        console.log(newMovesAndPlayer);
        console.log(game.moves);
        return res.json({ game, newMovesAndPlayer });
      }
      //if length is zero, then this is the first move and username1 would get the frist move

      game.moves[positionOfMove] = 'X';
      game.lastMoveBy = 'username1';
      await game.save();
      console.log('new game');
      console.log(game);
      console.log('line 46 end of the game');
      return res.json({ game });
    } catch (err) {
      return res.json({
        error: err,
        success: false,
        msg: "we couldn't make a new move in game. please try again",
      });
    }
  });

  return router;
};

function makeNextMove(game, positionOfMove) {
  console.log('previous move');
  if (game.lastMoveBy === 'username1') {
    game.moves[positionOfMove] = 'O';
    game.lastMoveBy = 'username2';
  } else {
    game.moves[positionOfMove] = 'X';
    game.lastMoveBy = 'username1';
  }
  return { moves: game.moves, lastMoveBy: game.lastMoveBy };
}
