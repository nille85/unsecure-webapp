# unsecure-webapp
 An unsecure web to showcase cybersecurity issues

## Installing the web app
* The web app is written using node and tested using version v19.7.0
* NPM is used as the package manager and testing using version v9.5.0

Installing the dependencies can be done via the following command
```
npm install
```

Running the app can be done via
```
node src/app.js
```
or 
```
nodemon
```
 
## Bruteforce of User Accounts
A script is added in the root directory `bruteforce.js`
It reads a file `rockyou-20.txt`(also in the root directory) which contains common passwords.

For each password in the file, the html form from the login page (index.html) is called using the password as the credential. 
When a match is found, the script shows the matched password in the terminal.

to run the script simply submit the following command:
```
node bruteforce.js
```




