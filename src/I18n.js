const vscode = require("vscode");
const poeditor = require("./Poeditor.js");

var parsePath = path => {
  return (
    path &&
    path
      .substring(0, path.indexOf("."))
      .split("/")
      .slice(1)
      .slice(-3)
      .join(".")
  );
};

function prepareTransKey() {
  const editor = vscode.window.activeTextEditor;
  let key = parsePath(editor.document.fileName);

  // TODO: detekovat element, případně kolik je již překladů v dokumentu, nebo jiný identifikátor

  return key;
}

function prepareTransFunction(key) {
  const editor = vscode.window.activeTextEditor;

  // TODO: vezme upravený klíč a udělá funkci pro překlad, zde bude potřeba detekovat kde se konkrétně SELECT nachází
  // zda je v HTML, nebo v PHP, nebo v JS

  switch (editor.document.languageId) {
    case "php":
      key = `{!! trans('${key}') !!}`;
      break;
    case "vue":
      key = `{{ $t('${key}') }}`;
      break;
  }

  return key;
}

function updateTrans(string, key, done) {
  poeditor.postKeyVal(string, key, () => {
    done()
  });
}

module.exports = {
  updateTrans,
  prepareTransKey,
  prepareTransFunction
};
