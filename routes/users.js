const router = require('express').Router();
const { getStatus } = require('../controllers/chat');

router.route('/status').get(getStatus);

module.exports = router