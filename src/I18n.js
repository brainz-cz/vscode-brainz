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
  let key = parsePath();

  // TODO: detekovat element, případně kolik je již překladů v dokumentu, nebo jiný identifikátor

  return key;
}

function prepareTransFunction(key) {
  const editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);
  const lang = editor.document.languageId;

  // TODO: vezme upravený klíč a udělá funkci pro překlad, zde bude potřeba detekovat
  // kde se konkrétně SELECT nachází
  // zda je v HTML, nebo v PHP, nebo v JS

  if (lang === "vue") {
    if (/^["`'][\S\s]*["`']$/.test(text)) {
      key = `this.$t('${key}')`;
    } else {
      key = `{{ $t('${key}') }}`;
    }
  } else if (lang === "php") {
    if (/^["`'][\S\s]*["`']$/.test(text)) {
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
