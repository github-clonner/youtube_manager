var express = require('express')
var router = express.Router()
var youtube = require('youtube-api')
var dataextractor = require('../classes/dataextractor')
var readJson = require('r-json')
var ytQuery = require('../classes/youtubequery')
var AuthenticationService = require('../services/AuthenticationService')
var SessionService = require('../services/SessionService')

const credentials = readJson('credentials.json')

let oauth = youtube.authenticate({
  type: 'oauth',
  client_id: credentials.web.client_id,
  client_secret: credentials.web.client_secret,
  redirect_url: credentials.web.redirect_uris[0]
})

/* GET home page. */
router.get('/', function (req, res, next) {
  let authInstance = new AuthenticationService()
  let session = new SessionService(req.session)
  let authDone = null

  if (req.session.valid) {
    authDone = req.session.valid
    req.session.valid = null
  }

  if (authDone === null) {
    return res.redirect(oauth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube']
    }))
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
  oauth.getToken(req.query.code, (err, tokens) => {
    if (err) {
      console.log(err)
      return
    }

    oauth.setCredentials(tokens)
    req.session.valid = true

    res.redirect('/')
  })
})

router.post('/submittags', (req, res, next) => {
  res.end(req.body.input_tags)
})

function extractData (data) {
  let dataExtractor = new dataextractor.DataExtractor(data)
  return dataExtractor.extractInfo(data)
}

module.exports = router
