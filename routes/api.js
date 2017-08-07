var YoutubeDataService = require('../services/YoutubeDataService')
var YoutubeService = require('../services/YoutubeService')
var AuthService = require('../services/AuthenticationService')

var express = require('express')
var models = require('../models')
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

    try {
      let subscriptions = await youtubeDataService.getSubscriptionsInfos(req.query.page, req.query.size)
      res.render('index', { ytData: subscriptions })
    }
    catch (error) {
      console.log(error.message)
    }
  }
})

router.put('/refresh', function (req, res, next) {
  
})

router.post('/tag/create', function (req, res, next) {
  models.Tag.create({
    title: req.body.title
  })
  .then((tag) => {
    res.json(tag.toJSON())
  })
  .error(next)
})

module.exports = router
