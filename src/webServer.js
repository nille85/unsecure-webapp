const express = require('express')
const app = express()
const path = require('path')
const { AuthenticationError } = require('./authentication')


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
        const userAuthenticator = this.userAuthenticator

        app.use(express.urlencoded({ extended: false }))
        //routes

        app.post('/login', function (req, res) {
            try {
                const { username, password } = req.body
                userAuthenticator.authenticate(username, password)
                res.send()
            } catch (err) {
                if(err instanceof AuthenticationError){
                    res.status(401).send()
                }
                res.status(500).send("Internal Server Error")
            }
        })

        //static folders
        app.use('/static', express.static(path.join(__dirname, '../../public')))
        app.listen(3000)

    }
}

module.exports = WebServer


