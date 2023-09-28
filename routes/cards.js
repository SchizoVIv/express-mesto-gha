const cardsRouter = require('express').Router();
const bodyParser = require('body-parser');
const {
  getCards, addCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');
const { idValidation, cardValidation } = require('../middlewares/validations');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValidation, addCard);
cardsRouter.delete('/:id', idValidation, deleteCard);
cardsRouter.put('/:id/likes', idValidation, putLike);
cardsRouter.delete('/:id/likes', idValidation, deleteLike);

cardsRouter.use(bodyParser.json());

module.exports = cardsRouter;
