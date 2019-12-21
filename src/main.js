const vscode = require("vscode");
const i18n = require("./I18n.js");

function activate(context) {
  let disposable = vscode.commands.registerCommand("brainz.i18n", i18n.init);

  context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
