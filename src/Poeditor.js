const vscode = require("vscode")
// const rp = require("request-promise");

function postKeyVal(key, value, done) {

    console.log(key, value);
    
    const config = vscode.workspace.getConfiguration("brainz");
    const apiKey = config && config.get("poeditorApiKey");

    console.log(apiKey);
    
    done()
    
}

module.exports = {
    postKeyVal
}