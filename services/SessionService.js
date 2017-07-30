class SessionService {

    constructor(session) {
        this.session = session
        this.session.valid = false
    }

    get valid ()        { return this.session.valid }
    set valid (valid)   { this.session.valid = valid }
}

exports.SessionService = SessionService