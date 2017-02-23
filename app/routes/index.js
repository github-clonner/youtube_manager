var express = require('express');
var router = express.Router();
var oauth = require('../youtube/oauthconnection');
var youtube = require('../youtube/youtubequery');

let oauthConnection = new oauth.OAuthConnection();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index");
  oauthConnection.authenticate();
  oauthConnection.generateUrl();
});

router.get('/oauthredirect', function(req, res, next) {
  oauthConnection.redirect(req, () => {
    let youtubeQuery = new youtube.YoutubeQuery();
    youtubeQuery.querySubscriptions()
                .then((data) => {
                  res.end(JSON.stringify(data));
                  process.exit();
                })
                .catch((error) => {
                  res.end(error.message);
                  process.exit();
                });
    });
});

module.exports = router;
