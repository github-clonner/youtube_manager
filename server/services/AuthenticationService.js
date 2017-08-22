let youtube = require('youtube-api')
let readJson = require('r-json')
let logger = require('bug-killer')

let instance = null

class AuthenticationService {

  constructor () {
    if (!instance) {
      this.oauth = null
      this.credentials = readJson('server/credentials.json')
      this.scope = ['https://www.googleapis.com/auth/youtube']
      instance = this
    }

    return instance
  }

  initAuthentication () {
    this.oauth = youtube.authenticate({
      type: 'oauth',
      client_id: this.credentials.web.client_id,
      client_secret: this.credentials.web.client_secret,
      redirect_url: this.credentials.web.redirect_uris[0]
    })

    if (this.oauth === null) {
      logger.error('AuthenticationService.initAuthentication: oauth null')
      throw new Error('Error while authenticating')
    }
  }

  generateAuthUrl (accessType) {
    return this.oauth.generateAuthUrl({ access_type: accessType, scope: this.scope })
  }

  redirectCallback (code) {
    return new Promise((resolve, reject) => {
      this.oauth.getToken(code, (err, tokens) => {
        if (err) {
          logger.error('AuthenticationService.redirectCallback: error getToken')
          reject(new Error(err))
        }

        this.oauth.setCredentials(tokens)

        resolve()
      })
    })
  }
}

exports.AuthenticationService = AuthenticationService
