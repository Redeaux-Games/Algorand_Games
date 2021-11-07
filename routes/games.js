var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("You're at the games.")
});

router.get('/HireForceMax', function(req, res, next) {
    res.render('games/HireForceMax', {title:"Hire Force Max Title"})
})

module.exports = router;