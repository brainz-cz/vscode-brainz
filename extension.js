const vscode = require("vscode");
// const rp = require("request-promise");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "brainz" is now active!');

  let disposable = vscode.commands.registerCommand(
    "extension.i18n",
    () => {

      const editor = vscode.window.activeTextEditor;
      const selection = editor.selection;
      const text = editor.document.getText(editor.selection);

      console.log(editor.document, selection, text);

      vscode.window
        .showInputBox({
          placeHolder: "Key for translated string",
          value: "pages.index.h1"
        })
        .then(key => {
          editor.edit(builder => builder.replace(selection, key));
        });

      // rp

      vscode.window.showInformationMessage("Hello World!");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
