const router = require('express').Router();
const { getStatus } = require('../controllers/chat');

router.route(':roomId/messages').get(getStatus);


module.exports = router