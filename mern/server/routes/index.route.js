const express = require('../../node_modules/express');
const registerRoutes = require('./register.route');

const router = express.Router();

router.use('/auth', registerRoutes);

module.exports = router;