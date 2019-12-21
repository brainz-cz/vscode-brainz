const vscode = require("vscode");
//const rp = require("request-promise");

const parsePath = path => {
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

function prepareKey() {
    
  const editor = vscode.window.activeTextEditor;
  let key = parsePath(editor.document.fileName);

  switch (editor.document.languageId) {
    case "php":
      key = `{!! trans('${key}') !!}`;
      break;
    case "vue":
      key = `{{ $t('${key}') }}`;
      break;
    default:
      key = key;
  }

  return key;
}

function uploadKeyAndString(string, trans, fn) {
  const config = vscode.workspace.getConfiguration("brainz");
  const apiKey = config && config.get("poeditorApiKey");

  //rp
  fn(trans + string + apiKey);
}

module.exports = {
  prepareKey,
  uploadKeyAndString
};
