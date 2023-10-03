const usersRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserInfo, updateAvatar, getUser,
} = require('../controllers/users');
const {
  updateUserValidation,
  updateAvatarValidation,
  idValidation,
} = require('../middlewares/validations');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:id', idValidation, getUserById);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserValidation, updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
