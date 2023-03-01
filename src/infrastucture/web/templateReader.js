const path = require('path')
const fs = require('fs')


class TemplateReader{

    constructor(path){
        this.path = path
    }

    static create(){
        return new TemplateReader(path)
    }

    readTemplate(fileName){
        console.log(__dirname)
        const templateDirPath = this.path.join(__dirname, '.', 'templates')
        try {
            const filePath = `${templateDirPath}/${fileName}`
            const html = fs.readFileSync(filePath, 'utf-8')
            return html
          } catch (err) {
            throw Error(`file with ${fileName} could not be read from template directory ${templateDirPath}, detail: ${err.message}`)
        }
    }
}

module.exports = TemplateReader