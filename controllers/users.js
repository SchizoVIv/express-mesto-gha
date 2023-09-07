const UserModel = require('../models/user');

const getUsers = (req, res) => {
  UserModel.find()
    .orFail()
    .then((users) => {
      if (users.length === 0) {
        res.status(400).send({
          message: 'Переданы некорректные данные при поиске пользователей',
        });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: 'Внутренняя ошибка сервера',
        });
    });
};

const getUserById = (req, res) => {
  UserModel.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при поиске пользователя',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Внутренняя ошибка сервера',
        });
    });
};

const createUser = (req, res) => {
  UserModel.create({ ...req.body })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Внутренняя ошибка сервера',
        });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении информации пользователя',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Внутренняя ошибка сервера',
        });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара пользователя'
        });
      } else {
        res.status(500).send('Внутренняя ошибка сервера');
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar
};
