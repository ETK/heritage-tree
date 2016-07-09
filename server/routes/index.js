'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/people', require('./people'));

// No matching routes - respond with 404
router.use(function (req, res) {
    res.status(404).end();
});
