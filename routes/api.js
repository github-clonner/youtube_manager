var YoutubeDataService = require('../services/YoutubeDataService')
var YoutubeService = require('../services/YoutubeService')
var AuthService = require('../services/AuthenticationService')
var SessionService = require('../services/SessionService')

var express = require('express')
var router = express.Router()

router.get('/subscriptions', async function (req, res, next) {
  let session = req.session
  let authInstance = new AuthService.AuthenticationService()

  if (!session.valid) {
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
  return
})

router.get('/page/previous', function (req, res, next) {
  res.end('previous')
  return
})

module.exports = router
