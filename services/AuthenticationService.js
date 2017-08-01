var youtube = require('youtube-api')
var readJson = require('r-json')
var logger = require('bug-killer')
var OAuthException = require('../exceptions/OAuthException')
var GetTokenException = require('../exceptions/GetTokenException')

let instance = null

class AuthenticationService {

  constructor (session) {
    if (!instance) {
      this.oauth = null
      //this.authenticationDone = false
      this.session = session
      this.credentials = readJson('./credentials.json')
      this.scope = ['https://www.googleapis.com/auth/youtube']
      instance = this
    }

    return instance
  }

  get authDone () { return this.session.valid }
  // set authDone (authdone) { this.authenticationDone = authdone }

  initAuthentication () {
    this.oauth = youtube.authenticate({
      type: 'oauth',
      client_id: this.credentials.web.client_id,
      client_secret: this.credentials.web.client_secret,
      redirect_url: this.credentials.web.redirect_uris[0]
    })

    if (this.oauth === null) {
      logger.error('AuthenticationService.initAuthentication: oauth null')
      throw new OAuthException('Error while authenticating')
    }
  }

  generateAuthUrl (accessType) {
    return this.oauth.generateAuthUrl({ access_type: accessType, scope: this.scope })
  }

  redirectCallback (code) {
    this.oauth.getToken(code, (err, tokens) => {
      if (err) {
        logger.error('AuthenticationService.redirectCallback: error getToken')
        throw new GetTokenException('Error while getting token')
      }

      logger.error('redirect ok')
      this.oauth.setCredentials(tokens)
      this.session.valid = true
    })
  }
}

exports.AuthenticationService = AuthenticationService
