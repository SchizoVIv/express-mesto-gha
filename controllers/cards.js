const CardModel = require('../models/card');
const {
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} = require('../utils/errors');

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { _id: userId } = req.user;

  CardModel.findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new ForbiddenError('Нет прав доступа');
      }
      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) {
        throw new BadRequestError('Проблема с картой');
      }
      return CardModel.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send({ data: deletedCard });
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при добавлении лайка'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при удалении карточки');
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Карточка не найдена');
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  putLike,
  deleteLike,
};
