const express = require('express')
const app = express()
const path = require('path')
const { AuthenticationError } = require('../../authentication')
const TemplateRenderer = require("./templateRenderer")


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

        app.get('/', function(req, res){
            const templateRenderer = TemplateRenderer.createFromFile("index.html")
            const html =  templateRenderer.renderWithoutData()
            res.send(html)

        })

        app.post('/', function (req, res) {
            try {
                const { username, password } = req.body
                userAuthenticator.authenticate(username, password)
                const html = TemplateRenderer.createFromFile("home.html").renderWithoutData()
                res.send(html)
            } catch (err) {
                if(err instanceof AuthenticationError){
                    const data = {validation : "Login Failed"}
                    const html = TemplateRenderer.createFromFile("index.html").renderWithData(data)
                    res.status(200).send(html)
                }else{
                    const html = TemplateRenderer.createFromFile("error.html").renderWithoutData()
                    res.status(200).send(html)
                }
                
            }
        })

        //static folders
        app.use('/static', express.static(path.join(__dirname, '../../public')))
        app.listen(3000)

    }
}

module.exports = WebServer