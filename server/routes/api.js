let { YoutubeManagerService } = require('../services/YoutubeManagerService')
let { YoutubeService } = require('../services/YoutubeService')
let { AuthenticationService } = require('../services/AuthenticationService')

let express = require('express')
let logger = require('bug-killer')
let router = express.Router()

let youtube = new YoutubeService()
let youtubeManagerService = new YoutubeManagerService(youtube)
let authInstance = new AuthenticationService()

router.get('/subscriptions', async function (req, res, next) {
  let session = req.session

  if (!session.valid) {
    authInstance.initAuthentication()
    return res.redirect(authInstance.generateAuthUrl('offline'))
  } else {
    try {
      let subscriptions = await youtubeManagerService.getExtractedData(req.query.page)
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
    await youtubeManagerService.refreshData()
    res.status(200)
  }
})

router.post('/tags-collection', async function (req, res, next) {
  try {
    let tags = await youtubeManagerService.createTagCollection(req.body)
    res.status(200).json(tags)
  } catch (error) {
    logger.error(error.message)
    res.status(500).json({error: 'Internal server error', message: error.message})
    next()
  }
})

router.get('/tags-collection', async function (req, res, next) {
  try {

  } catch (error) {
    logger.error(error.message)
    res.status(500).json({error: 'Internal server error', message: error.message})
    next()
  }
})

router.delete('/tags', async function (req, res, next) {
  try {

  } catch (error) {
    logger.error(error.message)
    res.status(500).json({error: 'Internal server error', message: error.message})
    next()
  }
})

module.exports = router
