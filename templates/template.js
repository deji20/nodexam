const fs = require("fs");

const templateHeader = fs.readFileSync(`${__dirname}/views/header.html`).toString();
const templateFooter = fs.readFileSync(`${__dirname}/views/footer.html`).toString();

module.exports = function render(page, placeholderReplacements){
    if(placeholderReplacements){
        Object.keys(placeholderReplacements).forEach((key) => {
            page = page.replace(`{${key}}`, placeholderReplacements[key]);
        })
    }
    return templateHeader + page + templateFooter;
}