const TemplateRenderer = require("./templateRenderer")

/*
A handler always has a request 
*/


class SessionHandler {

    constructor(request, response, userAuthenticator, handler) {
        this.request = request
        this.response = response
        this.userAuthenticator = userAuthenticator
        this.handler = handler
    }

    handle() {
        const sessionToken = this.getSessionToken(this.request)
        const session = this.userAuthenticator.validateSession(sessionToken)
        if (!session) {
            const html = TemplateRenderer.createFromFile("login.html").renderWithoutData()
            this.response.send(html)
        } else {
            return this.handler.handle()
        }
    }

    getSessionToken = (request) => {
        const cookies = request.cookies
        if (cookies) {
            const sessionToken = cookies["session_token"]
            return sessionToken
        } else {
            return undefined
        }
    }
}

class ErrorHandler {

    constructor(handler) {
        this.handler = handler
    }

    handle() {
        try {
            return this.handler.handle()
        } catch (error) {
            const html = TemplateRenderer.createFromFile("error.html").renderWithoutData()
            console.log(`An error occurred, message: ${error.message}`)
            console.error(error)
            this.handler.response.status(200).send(html)
        }
    }
}


class HomeHandler {

    constructor(request, response) {
        this.request = request
        this.response = response
    }

    static create(request, response, userAuthenticator){
        return new ErrorHandler(
            response,
            new SessionHandler(
                request,
                response,
                userAuthenticator,
                new HomeHandler(
                    request, 
                    response
                )
            )
        )
    }

    handle() {
        html = TemplateRenderer.createFromFile("home.html").renderWithData(session.userAccount)
    }
}

module.exports = { SessionHandler, ErrorHandler, HomeHandler }