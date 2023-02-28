class AuthenticationError extends Error{
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}

class UserAuthenticator{

    authenticate = (username, password) => {
        if(!(username === "devteam" && password === "verysecretpassword")){
            throw new AuthenticationError("Invalid credentials")
        }
    }
    
}

module.exports = {UserAuthenticator, AuthenticationError}