const WebServer = require('./webServer')
const {UserAuthenticator }= require('./authentication')


const webServer = WebServer.create(
    new UserAuthenticator()
)

webServer.run()

