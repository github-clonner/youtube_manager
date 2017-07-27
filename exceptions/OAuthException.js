class OAuthException {

    constructor(message) {
        this.message = message
        this.name = "OAuthException"
    }
}

exports.OAuthException = OAuthException