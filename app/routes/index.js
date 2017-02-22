var express = require('express');
var router = express.Router();
var yt = require('../youtube/search');

/* GET home page. */
router.get('/', function(req, res, next) {
  yt.init();
  res.end();
});

router.get('/oauthredirect', function(req, res, next) {
  yt.oauthredirect(req, res);
});

module.exports = router;
