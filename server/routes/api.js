var { YoutubeDataService } = require('../services/YoutubeDataService')
var { YoutubeService } = require('../services/YoutubeService')
var { AuthenticationService } = require('../services/AuthenticationService')
var { TagRepository } = require('../repositories/TagRepository')

var express = require('express')
var logger = require('bug-killer')
var router = express.Router()

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
  logger.info('Refreshing data')

  if (!session.valid) {
    authInstance.initAuthentication()
    return res.redirect(authInstance.generateAuthUrl('offline'))
  } else {
    await youtubeDataService.refreshData()
    res.end()
  }
})

router.post('/tags/create', async function (req, res, next) {
  logger.info(`creating tag : ${req.body.title}`)
  try {
    let tag = await tagRepository.create(req.body.title)
    res.json(tag.toJSON())
  } catch (error) {
    logger.error(error.message)
    next()
  }
})

module.exports = router
