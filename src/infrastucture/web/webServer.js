const express = require('express')
const app = express()
const path = require('path')
const { AuthenticationError } = require('../../authentication')
const TemplateRenderer = require("./templateRenderer")
const cookieParser = require('cookie-parser')


class WebServer {
    constructor(userAuthenticator) {
        this.userAuthenticator = userAuthenticator
    }

    static create(userAuthenticator) {
        return new WebServer(
            userAuthenticator
        )
    }

    run = () => {

        app.use(express.urlencoded({ extended: false }))
        app.use(cookieParser())
        //routes
        app.post('/', this.loginHandler)
        app.get('/', this.homeHandler)
        app.post('/logout', this.logoutHandler)
        //static folders
        const resolvedPath = path.join(__dirname, '../../../public')
        app.use('/static', express.static(resolvedPath))
        app.listen(3000)

    }

    loginHandler = (req, res) => {
        try {
            const { username, password } = req.body
            const { token, session } = this.userAuthenticator.authenticate(username, password)
            const { userAccount, expiresAt } = session
            const html = TemplateRenderer.createFromFile("home.html").renderWithData(userAccount)
            res.cookie("session_token", token, { expires: expiresAt })
            res.send(html)
        } catch (err) {
            if (err instanceof AuthenticationError) {
                const data = { validation: "Login Failed" }
                const html = TemplateRenderer.createFromFile("login.html").renderWithData(data)
                res.status(200).send(html)
            } else {
                this.errorHandler(err, res)
            }
        }
    }

    homeHandler = (req, res) => {
        try {
            const sessionToken = this.getSessionToken(req)
            const session = this.userAuthenticator.validateSession(sessionToken)
            let html
            if (session) {
                html = TemplateRenderer.createFromFile("home.html").renderWithData(session.userAccount)
            }
            else {
                html = TemplateRenderer.createFromFile("login.html").renderWithoutData()
            }
            res.send(html)
        } catch (err) {
            this.errorHandler(err, res)
        }
    }

    sessionHandler = (req, res, innerHandler) => {
        const sessionToken = this.getSessionToken(req)
        const session = this.userAuthenticator.validateSession(sessionToken)
        if (!session) {
            const html = TemplateRenderer.createFromFile("login.html").renderWithoutData()
            res.send(html)
        }else{
            innerHandler(req, res)
        }
    }

    getSessionToken = (req) => {
        const cookies = req.cookies
        if (cookies) {
            const sessionToken = cookies["session_token"]
            return sessionToken
        } else {
            return undefined
        }
    }





    logoutHandler = (req, res) => {
        try {
            console.log("logout was triggered")
            const sessionToken = this.getSessionToken(req)
            this.userAuthenticator.endSession(sessionToken)
            res.cookie("session_token", "", { expires: new Date() })
            res.redirect("/")
        } catch (err) {
            this.errorHandler(err, res)
        }

    }

    errorHandler = (error, res) => {
        const html = TemplateRenderer.createFromFile("error.html").renderWithoutData()
        console.log(`An error occurred, message: ${error.message}`)
        console.error(error)
        res.status(200).send(html)
    }

}

module.exports = WebServer