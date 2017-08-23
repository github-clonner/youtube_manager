let { YoutubeDataService } = require('../services/YoutubeDataService')
let { YoutubeService } = require('../services/YoutubeService')
let { AuthenticationService } = require('../services/AuthenticationService')
let { TagRepository } = require('../repositories/TagRepository')

let express = require('express')
let logger = require('bug-killer')
let router = express.Router()

let youtube = new YoutubeService()
let youtubeDataService = new YoutubeDataService(youtube)
let authInstance = new AuthenticationService()
let tagRepository = new TagRepository()

router.get('/subscriptions', async function (req, res, next) {
  let session = req.session

  if (!session.valid) {
    authInstance.initAuthentication()
    return res.redirect(authInstance.generateAuthUrl('offline'))
  } else {
    try {
      let subscriptions = await youtubeDataService.getSubscriptionsInfos(req.query.page)
      res.render('index', { ytData: subscriptions })
    } catch (error) {
      logger.error(error.message)
    }
  }
})

router.get('/refresh', async function (req, res, next) {
  let session = req.session

  if (!session.valid) {
    authInstance.initAuthentication()
    return res.redirect(authInstance.generateAuthUrl('offline'))
  } else {
    await youtubeDataService.refreshData()
    res.end()
  }
})

router.post('/tags', async function (req, res, next) {
  try {
    let tags = await tagRepository.create(req.body)
    res.json(tags)
  } catch (error) {
    logger.error(error.message)
    next()
  }
})

module.exports = router
