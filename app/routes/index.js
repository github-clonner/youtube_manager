var express = require('express');
var router = express.Router();
var oauth = require('../youtube/oauthconnection');

let oauthConnection = new oauth.OAuthConnection();

/* GET home page. */
router.get('/', function(req, res, next) {
  oauthConnection.authenticate();
  oauthConnection.generateUrl();
  res.end();
});

router.get('/oauthredirect', function(req, res, next) {
  oauthConnection.redirect(req, res);
});

module.exports = router;
