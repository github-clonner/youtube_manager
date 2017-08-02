var express = require('express')
var router = express.Router()
var dataextractor = require('../classes/dataextractor')
var ytQuery = require('../classes/youtubequery')
var AuthService = require('../services/AuthenticationService')
var SessionService = require('../services/SessionService')

/* GET home page. */
router.get('/', function (req, res, next) {
  let session = new SessionService.SessionService(req.session)
  let authInstance = new AuthService.AuthenticationService(session)

  if (!authInstance.authDone) {
    authInstance.initAuthentication()
    return res.redirect(authInstance.generateAuthUrl('offline'))
  } else {
    let youtubeQuery = new ytQuery.YoutubeQuery()
    youtubeQuery.querySubscriptions()
                .then((data) => {
                  let ytData = extractData(data)
                  res.render('index', { ytData: ytData })
                })
                .catch((error) => {
                  res.end(error.message)
                  process.exit()
                })
  }
})

router.get('/oauthredirect', function (req, res, next) {
  let session = new SessionService.SessionService(req.session)
  let authInstance = new AuthService.AuthenticationService(session)

  try {
    authInstance.redirectCallback(req.query.code, () => { res.redirect('/') })
  } catch (e) {
    res.end('Error while authenticating: ' + e.message)
  }
})

router.post('/submittags', (req, res, next) => {
  res.end(req.body.input_tags)
})

function extractData (data) {
  let dataExtractor = new dataextractor.DataExtractor(data)
  return dataExtractor.extractInfo(data)
}

module.exports = router
