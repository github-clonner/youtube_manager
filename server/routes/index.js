let express = require('express')
let router = express.Router()

let { AuthenticationService } = require('../services/AuthenticationService')

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    let session = req.session
    let authInstance = new AuthenticationService(session)

    if (!session.valid) {
      authInstance.initAuthentication()
      return res.redirect(authInstance.generateAuthUrl('offline'))
    }

    res.redirect('/api/subscriptions?size=10')
  } catch (error) {
    res.end('Error while authentication init: ' + error.message)
    process.exit()
  }
})

router.get('/oauthredirect', async function (req, res, next) {
  let authInstance = new AuthenticationService(session)
  let session = req.session

  try {
    await authInstance.redirectCallback(req.query.code)
    session.valid = true
    res.redirect('/api/subscriptions')
  } catch (error) {
    session.valid = false
    res.end(error.message)
    return
  }
})

module.exports = router
