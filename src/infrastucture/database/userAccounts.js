class UserAccountRepository{

    constructor(userAccounts){
        this.userAccounts = userAccounts
    }

    static createEmpty(){
        return new UserAccountRepository([])
    }

    static create(userAccounts){
        return new UserAccountRepository(userAccounts)
    }


    save = (userAccount) => {
        this.userAccounts.push(userAccount)
    }

    findByUsernameAndPassword = (username, password) => {
        const filteredAccounts = this.userAccounts.filter(userAccount => {
            return (userAccount.username == username && userAccount.password == password)
        })
        if(filteredAccounts.length !== 0){
            return filteredAccounts[0]
        }else{
            throw new UserAccountNotFound(`No user account was found for the provided credentials`)
        }

    }
}

class UserAccountNotFound extends Error{
    constructor(message) {
        super(message);
        this.name = "UserAccountNotFound";
    }
}


module.exports = {UserAccountRepository, UserAccountNotFound}