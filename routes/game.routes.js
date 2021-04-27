const router = require('express').Router();
const { Types } = require('mongoose');
const Game = require('../models/game.model');
const auth = require('../middilwares/auth');
const { startGameValidatoin, validateRequestParamsId } = require('../middilwares/validations');
const {
  isTied,
  playerHasWon,
  makeNextMove,
  isPositionAlreadyFilled,
} = require('../utils/game-routes.util');

// with every request we return error to false if everything goes well. if something goes wrong from our side, we return error true with msg
module.exports = () => {
  router.post('/new', auth, startGameValidatoin, async (req, res) => {
    try {
      const { username1, username2 } = req.body;
      const game = new Game({ username1, username2, status: 'on-going', currentPlayer: username1 });
      // initial the game by setting moves array to 9 empty string
      game.moves = ['', '', '', '', '', '', '', '', ''];
      await game.save();
      return res.json({ game, error: false, msg: 'game has started' });
    } catch (err) {
      return res.status(500).json({
        error: true,
        msg: "we couldn't start game. Soemthing went wrong from our side. please try again",
      });
    }
  });

  router.post('/move', auth, async (req, res) => {
    try {
      const gameId = await Types.ObjectId(req.body.gameId);
      const game = await Game.findById(req.body.gameId);
      const { positionOfMove } = req.body;
      // check if game with provided is not there
      if (!game) {
        return res.json({ msg: `Game with id ${gameId} does not exists` });
      }

      // check if game is comeptled or already finsihed
      if (game.isComplete) {
        return res.json({ msg: 'game is already finsihed. Start new game', error: false });
      }
      // check if moves[positionOfMove] returns undefined, which means this is not position we can make move: like -1 or 10 or any such number that is invalid for us
      if (game.moves[positionOfMove] === undefined) {
        return res.json({
          msg: `Position ${positionOfMove} is invalid. You cannon play at this position. Please choose 0 or 8 or any number between them`,
          error: false,
        });
      }
      // check if this position has already been played or filled;
      if (isPositionAlreadyFilled(game.moves[positionOfMove])) {
        // if its then send a msg
        return res.json({
          msg: `Position ${positionOfMove} is already has been played. You cannon play at this position again. Please play another position`,
          error: false,
        });
      }
      const newMovesAndPlayer = makeNextMove(game, positionOfMove);
      // check if someone has won the game
      if (playerHasWon(newMovesAndPlayer.moves, game.currentPlayer)) {
        // because change the currentPlayer using newMoveandPlayer, we are getting the currnet player this. THis is not efficient but should work
        const thePreviousPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        await Game.findByIdAndUpdate(gameId, {
          moves: newMovesAndPlayer.moves,
          currentPlayer: newMovesAndPlayer.currentPlayer,
          isComplete: true,
          isTied: false,
          winner: thePreviousPlayer,
        });

        return res.json({ won: true, winner: thePreviousPlayer, error: false });
      }
      // check if there is a tie
      if (isTied(newMovesAndPlayer.moves)) {
        // game is tied
        await Game.findByIdAndUpdate(gameId, {
          moves: newMovesAndPlayer.moves,
          currentPlayer: newMovesAndPlayer.currentPlayer,
          isComplete: true,
          isTied: true,
          winner: null,
        });
        return res.json({ tied: true, isGameOVer: true, error: false });
      }
      await Game.findByIdAndUpdate(gameId, {
        moves: newMovesAndPlayer.moves,
        currentPlayer: newMovesAndPlayer.currentPlayer,
      });
      return res.json({ game, newMovesAndPlayer });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: true,

        msg: "we couldn't make a new move in game. please try again",
      });
    }
  });

  router.get('/:id/status', validateRequestParamsId, auth, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game) {
        // return game status
        return res.json({
          gameId: game._id,
          status: { inProgress: !game.isComplete, isTied: game.isTied, error: false },
        });
      }
      // else no game with this id exists
      return res.json({ msg: `No game with id ${req.params.id} exist` });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, msg: 'someting went wrong from our side. We apologize.' });
    }
  });
  return router;
};
