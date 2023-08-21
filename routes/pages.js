const { register, login } = require('../controllers/pages');
const router = require('express').Router();

router.get('/register', register);
router.get('/login', login);

module.exports = router