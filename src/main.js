const vscode = require("vscode")
const poeditor = require("./Poeditor.js")

function activate(context) {

  let disposable = vscode.commands.registerCommand("brainz.i18n", () => {
    
    const editor = vscode.window.activeTextEditor;
    const selection = editor.selection;
    const text = editor.document.getText(editor.selection);

    vscode.window
      .showInputBox({
        placeHolder: "Key for translated string",
        value: poeditor.prepareKey()
      })
      .then(result => {

        poeditor.uploadKeyAndString(text, result, response => {

          editor.edit(builder => builder.replace(selection, response));

        });

        vscode.window.showInformationMessage(
          "Translated string was uploaded to poeditor.com \n" + result
        );

      });
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
