const authRouter = require('express').Router();
const bodyParser = require('body-parser');
const { createUser, login } = require('../controllers/users');
const {
  signinValidation,
  signupValidation,
} = require('../middlewares/validations');

authRouter.post('/signup', signupValidation, createUser);
authRouter.post('/signin', signinValidation, login);

authRouter.use(bodyParser.json());

module.exports = authRouter;
