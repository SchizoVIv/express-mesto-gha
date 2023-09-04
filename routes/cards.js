const cardsRouter = require('express').Router();
const bodyParser = require('body-parser');
const { getCards, addCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', addCard);
cardsRouter.delete('/:id', deleteCard);
cardsRouter.put('/:id/likes', putLike);
cardsRouter.delete('/:id/likes', deleteLike);

cardsRouter.use(bodyParser.json());

module.exports = cardsRouter;
