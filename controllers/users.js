const UserModel = require('../models/user');

const getUsers = (req, res) => {
  UserModel.find()
    .orFail()
    .then((users) => {
      if (users.length === 0) {
        res.status(400).send({
          message: 'Incorrect data',
        });
      } else {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: 'Server error',
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
          message: 'Incorrect data',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Server error',
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
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
        });
      }

      return res
        .status(500)
        .send({
          message: 'Server error',
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
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Server error',
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
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`
        });
      } else {
        res.status(500).send('Server error');
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
