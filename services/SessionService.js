let instance = null

class SessionService {

    constructor(session) {
        if (!instance) {
            this.session = session
            this.session.valid = false
            this.instance = instance
        }

        return instance
    }

    get valid ()        { return this.session.valid }
    set valid (valid)   { this.session.valid = valid }
}

exports.SessionService = SessionService