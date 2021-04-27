const router = require('express').Router();
const { registerUserValidation, loginVadiation } = require('../middilwares/validations');
const User = require('../models/user.model');

module.exports = () => {
  router.post('/register', registerUserValidation, async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      res.status(201).send({ succes: true, msg: 'user was successfully create. please login now' });
    } catch (e) {
      res
        .status(400)
        .json({ error: true, msg: 'something went wrong from our side.Please try again' });
    }
  });

  router.post('/login', loginVadiation, async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      if (!user) {
        // either password didn't match or user is not reigstered;
        return res.json({ error: true, msg: 'Either password is wrong or you are not reigstered' });
      }
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (e) {
      res
        .status(400)
        .json({ error: true, msg: 'something went wrong from our side.Please try again' });
    }
  });

  router.post('/logout', async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
      await req.user.save();
      res.send();
    } catch (e) {
      res
        .status(500)
        .json({ error: true, msg: 'something went wrong from our side.Please try again' });
    }
  });

  return router;
};
