const CardModel = require('../models/card');

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({
      message:
        'Server error',
    }));
};

const addCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Transmission of incorrect data',
        });
      } else {
        res.status(500).send({
          message: 'Server error',
        });
      }
    });
};

const deleteCard = (req, res) => {
  CardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({
          message: 'Document not found',
        });
      }
    });
};

const putLike = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Incorrect data',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Document not found',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Server error',
        });
    });
};

const deleteLike = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Incorrect data',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Document id not found',
        });
      }

      return res
        .status(500)
        .send({
          message: 'Server error',
        });
    });
};

module.exports = { getCards, addCard, deleteCard, putLike, deleteLike };
