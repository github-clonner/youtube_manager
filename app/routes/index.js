var express = require('express')
var router = express.Router()
var oauth = require('../classes/oauthconnection')
var youtube = require('../classes/youtubequery')
var extractor = require('../classes/subscriptionsextraction')

let oauthConnection = new oauth.OAuthConnection()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.end()
  oauthConnection.authenticate()
  oauthConnection.generateUrl()
})

router.get('/oauthredirect', function (req, res, next) {
  oauthConnection.redirect(req, () => {
    let youtubeQuery = new youtube.YoutubeQuery()
    youtubeQuery.querySubscriptions()
                .then((data) => {
                  let ytData = extractData(data)
                  res.render('index', { ytData: ytData })
                })
                .catch((error) => {
                  res.end(error.message)
                  process.exit()
                })
  })
})

function extractData (data) {
  let dataExtractor = new extractor.SubscriptionsExtraction(data)
  return dataExtractor.extractInfo(data)
}

module.exports = router
