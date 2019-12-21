const vscode = require("vscode");
const i18n = require("./I18n.js");

function activate(context) {

  let disposable = vscode.commands.registerCommand("brainz.i18n", () => {

    const editor = vscode.window.activeTextEditor;
    const selection = editor.selection;
    const text = editor.document.getText(editor.selection);

    vscode.window
      .showInputBox({
        placeHolder: "Key for translated string",
        value: i18n.prepareTransKey()
      })
      .then(result => {

        result && i18n.updateTrans(text, result, () => {

          editor.edit(builder =>
            builder.replace(selection, i18n.prepareTransFunction(result))
          );

          vscode.window.showInformationMessage(
            "Translated string was uploaded to poeditor.com"
          );
          
        });

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
