const router = require('express').Router();
const authRoutes = require('./auth.routes');

const auth = require('../middilwares/auth');
const gameRoutes = require('./game.routes');

module.exports = () => {
  router.get('/', (req, res) => res.send('Hello world'));
  router.get('/private', auth, (req, res) => res.send('private route buddy'));
  router.use('/auth', authRoutes());
  router.use('/games', gameRoutes());
  return router;
};
