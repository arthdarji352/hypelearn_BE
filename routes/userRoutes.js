var express = require('express');

var router = express.Router();

const { getUser } = require('../controllers/userController');

router.post('/getUser', getUser);

router.delete('/');

router.patch('/');

module.exports = router;
