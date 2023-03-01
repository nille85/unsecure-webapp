const {UserAccountNotFound} = require("./infrastucture/database/userAccounts")

class AuthenticationError extends Error{
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}

class UserAuthenticator{

    constructor(userAccountRepository){
        this.userAccountRepository = userAccountRepository
    }

    authenticate = (username, password) => {
        try{
            const userAccount = this.userAccountRepository.findByUsernameAndPassword(username, password)
            return userAccount
        }catch(error){
            if(error instanceof UserAccountNotFound){
                throw new AuthenticationError("Invalid credentials")
            }
            throw new Error("unexpected error")
        }
    }
    
}

module.exports = {UserAuthenticator, AuthenticationError}