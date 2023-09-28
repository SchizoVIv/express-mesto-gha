const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const authsRouter = require('./auths');
const { auth } = require('../middlewares/auth');

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('/', authsRouter);

module.exports = router;
