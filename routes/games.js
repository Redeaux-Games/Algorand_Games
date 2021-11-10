var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res, next) {
    const games = fs.readdirSync(path.join(__dirname, '../public/games'));
    res.render('games', {title: 'RPGGames.Fun', games: games});
});

router.get("/:game", function(req, res, next) {
    res.render("games/index", {title: req.params.game});
})

module.exports = router;