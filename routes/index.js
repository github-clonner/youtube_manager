var express = require('express')
var router = express.Router()

var YoutubeDataService = require('../services/YoutubeDataService')
var Youtube = require('../services/YoutubeService')
var AuthService = require('../services/AuthenticationService')
var SessionService = require('../services/SessionService')

/* GET home page. */
router.get('/', async function (req, res, next) {
  let session = new SessionService.SessionService(req.session)
  let authInstance = new AuthService.AuthenticationService(session)

  try {
    if (!authInstance.authDone) {
      authInstance.initAuthentication()
      return res.redirect(authInstance.generateAuthUrl('offline'))
    } else {
      let youtubeQuery = new Youtube.YoutubeQuery()
      let data = await youtubeQuery.querySubscriptions()
      let ytData = extractData(data)
      res.render('index', { ytData: ytData })
    }
  } catch (e) {
    res.end('Error while authentication init: ' + e.message)
    process.exit()
  }
})

router.get('/oauthredirect', async function (req, res, next) {
  let session = new SessionService.SessionService(req.session)
  let authInstance = new AuthService.AuthenticationService(session)

  await authInstance.redirectCallback(req.query.code)
  res.redirect('/')
})

router.post('/submittags', (req, res, next) => {
  res.end(req.body.input_tags)
  process.exit()
})

function extractData (data) {
  let dataExtractor = new YoutubeDataService.DataExtractor(data)
  return dataExtractor.extractInfo(data)
}

module.exports = router
