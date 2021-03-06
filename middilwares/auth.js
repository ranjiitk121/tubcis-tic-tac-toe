const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '').trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {});
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      return res.status(401).send({ error: 'authenicatoin failed. Please login' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.', e });
  }
};

module.exports = auth;
