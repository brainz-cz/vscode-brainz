const vscode = require("vscode");
const request = require("request");

const url = "https://api.poeditor.com/v2";

function parseEnv(src) {
  try {
    return JSON.parse(src.toString());
  } catch (err) {
    const result = {};
    const lines = src.toString().split("\n");
    for (const line of lines) {
      const match = line.match(/^([^=:#]+?)[=:](.*)/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        result[key] = value;
      }
    }
    return result;
  }
}

function getEnv(next) {
  vscode.workspace
    .openTextDocument(vscode.workspace.workspaceFolders[0].uri.path + "/.env")
    .then(document => {
      let text = document.getText();
      let env = parseEnv(text);
      next(env);
    });
}

function postKeyVal(key, value, done) {
  const config = vscode.workspace.getConfiguration("brainz");
  const globalApiKey = config && config.get("poeditorApiKey");

  let languages = [
    {
      term: key,
      translation: {
        content: value
      }
    }
  ];

  let terms = [
    {
      term: key
    }
  ];

  getEnv(env => {

    let apiKey = globalApiKey 
      ? globalApiKey 
      : env.POEDITOR_API_KEY;

    let projectId = env.POEDITOR_PROJECT_ID 
      ? env.POEDITOR_PROJECT_ID 
      : "";

    let defaultCode = env.POEDITOR_DEFAULT_CODE
      ? env.POEDITOR_DEFAULT_CODE
      : "";

    request.post(
      `${url}/terms/add`,
      {
        form: {
          api_token: apiKey,
          id: projectId,
          data: JSON.stringify(terms)
        }
      },
      (err, res) => {
        if (!err && res.statusCode == 200) {
          request.post(
            `${url}/languages/update`,
            {
              form: {
                api_token: apiKey,
                id: projectId,
                language: defaultCode,
                data: JSON.stringify(languages)
              }
            },
            (err, res) => {
              if (!err && res.statusCode == 200) {
                done();
              }
            }
          );
        }
      }
    );
  });
}

module.exports = {
  postKeyVal
};
