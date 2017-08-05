var YoutubeDataService = require('../services/YoutubeDataService')
var YoutubeService = require('../services/YoutubeService')
var AuthService = require('../services/AuthenticationService')
var SessionService = require('../services/SessionService')

var express = require('express')
var router = express.Router()

router.get('/subscriptions', async function (req, res, next) {
  let session = new SessionService.SessionService(req.session)
  let authInstance = new AuthService.AuthenticationService(session)

  if (!authInstance.authDone) {
      authInstance.initAuthentication()
      return res.redirect(authInstance.generateAuthUrl('offline'))
    } else {
      let youtube = new YoutubeService.YoutubeService()
      let youtubeDataService = new YoutubeDataService.YoutubeDataService(youtube)
  
      let subscriptions = await youtubeDataService.getSubscriptionsInfos()

      res.render('index', { ytData: subscriptions })
    }
})

router.get('/page/next', function (req, res, next) {
  res.end('next')
})

router.get('/page/previous', function (req, res, next) {
  res.end('previous')
})

module.exports = router
