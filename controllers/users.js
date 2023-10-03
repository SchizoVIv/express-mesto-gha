const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UserModel = require('../models/user');
const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require('../utils/errors');

const SOLT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  UserModel.findById(req.params.id)
    .then((user) => {
      if (user === null) throw new NotFoundError('Пользователь с таким id не найден');

      if (!validator.isMongoId(req.params.id)) {
        throw new BadRequestError('Введите правильный ID пользователя');
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  const userId = req.user._id;

  UserModel.findById(userId)
    .then((user) => {
      if (user === null) throw new NotFoundError('Cписок пользователей пуст');

      return res.status(200).send({ user });
    })
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) return res.status(200).send(user);

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError('Переданы некорректные данные при регистрации пользователя');
    }

    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const user = await UserModel.create({ email, password: hash });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Не указан логин или пароль');
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Такого пользователя не существует');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedError('Неверный логин или пароль');
    }

    const payload = { _id: user._id, email: user.email };

    const token = jwt.sign(payload, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev_secret', { expiresIn: '7d' });

    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });

    res.status(200).send({
      _id: user._id,
      message: 'Вы успешно авторизированы',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
  getUser,
};
