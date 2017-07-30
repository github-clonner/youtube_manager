var youtube = require('youtube-api')
var readJson = require('r-json')
var logger = require('bug-killer')
var oAuthException = require('../exceptions/OAuthException')
var getTokenException = require('../exceptions/GetTokenExceptions')
var session = require('./SessionService')

const credentials = readJson('../credentials.json')

let instance = null

class AuthenticationService {

    constructor() {
        if (!instance) {
            this.oauth = null
            this.authDone = false
            instance = this
        }

        return instance
    }

    get authDone () { return this.authDone }

    initAuthentication() {
        this.oauth = youtube.authenticate({
            type: 'oauth',
            client_id: credentials.web.client_id,
            client_secret: credentials.web.client_secret,
            redirect_url: credentials.web.redirect_uris[0]
        })
        
        if (this.oauth === null) {
            logger.error("AuthenticationService.initAuthentication: oauth null")
            throw new oAuthException("Error while authenticating")
        }
    }

    redirectCallback(code) {
        this.oauth.getToken(code, (err, tokens) => {
            if (err) {
                logger.error("AuthenticationService.redirectCallback: error getToken")
                throw new getTokenException("Error while getting token")
            }

            this.oauth.setCredentials(tokens)

            
        })
    }
}

exports.AuthenticationService = AuthenticationService