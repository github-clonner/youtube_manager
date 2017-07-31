var youtube = require('youtube-api')
var readJson = require('r-json')
var logger = require('bug-killer')
var OAuthException = require('../exceptions/OAuthException')
var GetTokenException = require('../exceptions/GetTokenException')
var Session = require('./SessionService')

const credentials = readJson('./credentials.json')

let instance = null

class AuthenticationService {

  constructor () {
    if (!instance) {
      this.oauth = null
      this.authDone = false
      this.session = new Session()
      instance = this
    }

    return instance
  }

  get authDone () { return this.authDone }

  initAuthentication () {
    this.oauth = youtube.authenticate({
      type: 'oauth',
      client_id: credentials.web.client_id,
      client_secret: credentials.web.client_secret,
      redirect_url: credentials.web.redirect_uris[0]
    })

    if (this.oauth === null) {
      logger.error('AuthenticationService.initAuthentication: oauth null')
      throw new OAuthException('Error while authenticating')
    }
  }

  redirectCallback (code) {
    this.oauth.getToken(code, (err, tokens) => {
      if (err) {
        logger.error('AuthenticationService.redirectCallback: error getToken')
        throw new GetTokenException('Error while getting token')
      }

      this.oauth.setCredentials(tokens)
      this.session.valid = true
    })
  }
}

exports.AuthenticationService = AuthenticationService
