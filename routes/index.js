const router = require('express').Router();
const authRoutes = require('./auth.routes');

const auth = require('../middilwares/auth');
const gameRoutes = require('./game.routes');

module.exports = () => {
  router.get('/', (req, res) => res.render('welcome'));
  router.get('/game-board', (req, res) => res.render('index'));
  router.get('/private', auth, (req, res) => res.send('private route buddy'));
  router.use('/auth', authRoutes());
  router.use('/games', gameRoutes());
  return router;
};
