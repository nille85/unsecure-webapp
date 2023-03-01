const { UserAccountNotFound } = require("./infrastucture/database/userAccounts")
const uuid = require('uuid')


class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}

class Session {
    constructor(userAccount, expiresAt) {
        this.userAccount = userAccount
        this.expiresAt = expiresAt
    }

    static create(userAccount) {
        const now = new Date()
        const expiresAt = new Date(+now + 120 * 1000)
        return new Session(
            userAccount,
            expiresAt
        )
    }

    isExpired() {
        this.expiresAt < new Date()
    }
}

class UserAuthenticator {

    constructor(userAccountRepository) {
        this.userAccountRepository = userAccountRepository
        this.sessions = {}
    }

    authenticate = (username, password) => {
        try {
            const userAccount = this.userAccountRepository.findByUsernameAndPassword(username, password)
            const session = Session.create(userAccount)
            const token = uuid.v4()
            this.sessions[token] = session
            return { token, session }
        } catch (error) {
            if (error instanceof UserAccountNotFound) {
                throw new AuthenticationError("Invalid credentials")
            }
            console.log(error)
            throw new Error("unexpected error")
        }
    }

    endSession = (sessionToken) => {
        delete this.sessions[sessionToken]
    }


    validateSession = (sessionToken) => {
        const session = this.sessions[sessionToken]
        if (session) {
            if (!session.isExpired()) {
                return session
            } else {
                this.endSession(sessionToken)
            }
        }
        return undefined

    }

}

module.exports = { UserAuthenticator, AuthenticationError }