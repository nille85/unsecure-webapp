const WebServer = require('./infrastucture/web/webServer')
const {UserAuthenticator }= require('./authentication')
const {UserAccountRepository} = require('./infrastucture/database/userAccounts')


const userAccounts = [
    {username: "devteam", password: "mahal"}
]
const userAccountRepository = new UserAccountRepository(
    userAccounts
)

const webServer = WebServer.create(
    new UserAuthenticator(
        userAccountRepository
    )
)

webServer.run()

