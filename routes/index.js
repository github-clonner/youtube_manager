var express = require('express')
var router = express.Router()

var YoutubeDataService = require('../services/YoutubeDataService')
var YoutubeService = require('../services/YoutubeService')
var AuthService = require('../services/AuthenticationService')
var SessionService = require('../services/SessionService')

/* GET home page. */
router.get('/', async function (req, res, next) {
  let authInstance = new AuthService.AuthenticationService(session)

  try {
    var session = req.session

    if (!session.valid) {
      authInstance.initAuthentication()
      return res.redirect(authInstance.generateAuthUrl('offline'))
    }
    
    res.redirect('/api/subscriptions')
  } catch (error) {
    res.end('Error while authentication init: ' + error.message)
    process.exit()
  }
})

router.get('/oauthredirect', async function (req, res, next) {
  let authInstance = new AuthService.AuthenticationService()
  let session = req.session
  
  try {
    await authInstance.redirectCallback(req.query.code)
    session.valid = true
    res.redirect('/api/subscriptions')
  } catch (error) {
    session.valid = false
    res.end("erreur")
    return
  }
})

router.post('/submittags', (req, res, next) => {
  res.end(req.body.input_tags)
  process.exit()
})

module.exports = router
