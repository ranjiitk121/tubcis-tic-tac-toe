const router = require('express').Router();
const { registerUserValidation, loginVadiation } = require('../middilwares/validations');
const User = require('../models/user.model');

module.exports = () => {
  router.post('/register', registerUserValidation, async (req, res) => {
    const user = new User(req.body);

    try {
      await user.save();

      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.post('/login', loginVadiation, async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  });

  router.post('/logout', async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  });

  return router;
};
