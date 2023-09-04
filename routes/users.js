const usersRouter = require('express').Router();
const bodyParser = require('body-parser');
const UserModel = require('../models/user');
const { getUsers, getUserById, createUser, updateUserInfo, updateAvatar } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);

usersRouter.use(bodyParser.json());

module.exports = usersRouter;
