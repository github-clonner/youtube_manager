var youtube = require('youtube-api')
var readJson = require('r-json')
var logger = require('bug-killer')
var oAuthException = require('../exceptions/OAuthException')

const credentials = readJson('../credentials.json')

class AuthenticationService {

    constructor() {
        this.oauth = null
    }

    initAuthentication() {
        oauth = youtube.authenticate({
            type: 'oauth',
            client_id: credentials.web.client_id,
            client_secret: credentials.web.client_secret,
            redirect_url: credentials.web.redirect_uris[0]
        })
        
        if (oauth === null) {
            logger.error("oauth null")
            throw new oAuthException("Error while authenticating")
        }
    }

    redirectCallback(code) {
        oauth.getToken(code, (err, tokens) => {
            if (err) {
                logger.log(err)
                return false
            }
        })
    }
}