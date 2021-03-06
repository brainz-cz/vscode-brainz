const vscode = require("vscode");
const poeditor = require("./Poeditor.js");

function parsePath() {
  const currentDocument = vscode.window.activeTextEditor.document.fileName;
  const projectFolder = vscode.workspace.name;

  return (
    currentDocument &&
    currentDocument
      .split(projectFolder + "/")
      .pop()
      .split(".")[0]
      .split("/")
      .join(".")
  );
}

function prepareTransKey() {
  // TODO: detekovat element, přidat další identifikátor ke klíči, aby byl víc vypovídající
  // zkusit najít jak udělat GET vscode breadcrumbs

  let key = parsePath();
  let documentText = vscode.window.activeTextEditor.document.getText();
  let count = (documentText.match(new RegExp(key, "g")) || []).length;
  return `${key}-${count + 1}`;
}

function prepareTransFunction(key) {
  const editor = vscode.window.activeTextEditor;
  const lang = editor.document.languageId;

  let selection = new vscode.Range(
    new vscode.Position(
      editor.selection.start.line,
      editor.selection.start.character - 1
    ),
    new vscode.Position(
      editor.selection.end.line,
      editor.selection.end.character + 1
    )
  );

  let text = editor.document.getText(selection);
  let isInString = /^["`'][\S\s]*["`']$/.test(text.trim());

  if (lang === "vue") {
    if (isInString) {
      key = `this.$t('${key}')`;
    } else {
      key = `{{ $t('${key}') }}`;
    }
  } else if (lang === "php") {
    if (isInString) {
      key = `trans('${key}')`;
    } else {
      key = `{!! trans('${key}') !!}`;
    }
  }

  return key;
}

function updateTrans(string, key, done) {
  poeditor.postKeyVal(key, string, () => {
    done();
  });
}

function init() {
  const editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);
  const selection = editor.selection;

  text &&
    vscode.window
      .showInputBox({
        placeHolder: "Key for translated string",
        value: prepareTransKey()
      })
      .then(result => {
        result &&
          updateTrans(text, result, () => {
            editor.edit(builder =>
              builder.replace(selection, prepareTransFunction(result))
            );

            vscode.window.showInformationMessage(
              "Translated string was uploaded to poeditor.com"
            );
          });
      });
}

module.exports = {
  init
};
