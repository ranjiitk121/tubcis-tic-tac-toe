const { body, check, checkSchema } = require('express-validator');
const { Types } = require('mongoose');
const startGameValidatoin = [
  body('username1')
    .not()
    .isEmpty()
    .withMessage('username One is required')
    .bail()
    .trim()
    .escape()
    .withMessage('Player One is required'),
  body('username2')
    .not()
    .isEmpty()
    .withMessage('username two is required')
    .bail()
    .trim()
    .escape()
    .withMessage('username two is required'),
];
const registerUserValidation = [
  body('name')
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .bail()
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('name is required'),
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is requried')
    .bail()
    .trim()
    .normalizeEmail()
    .isEmail()
    .escape()
    .withMessage('A valid email is required'),
  body('password')
    .not()
    .isEmpty()
    .withMessage('A Password is required')
    .bail()
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage('Password greater at least 5 character is requierd'),
];

const loginVadiation = registerUserValidation
  .slice(1, 2)
  .concat([body('password').not().isEmpty().trim().escape().withMessage('A Password is required')]);

const validateRequestParamsId = [
  // for validating id provided by users as request paramete
  check('id')
    .escape()
    .not()
    .isEmpty()
    .trim()
    .customSanitizer(async (value) => {
      try {
        const id = await Types.ObjectId(value);
        return id;
      } catch (err) {
        throw new Error("couldn't find resrouce you are looking");
      }
    })
    .bail()
    .withMessage('resource (user prifle or podcast ) with id is not avaliable.'),
];
module.exports = {
  registerUserValidation,
  startGameValidatoin,
  loginVadiation,
  validateRequestParamsId,
};
