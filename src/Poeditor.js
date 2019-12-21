const vscode = require("vscode");
const request = require("request");

const url = "https://api.poeditor.com/v2";

function postKeyVal(key, value, done) {
  const config = vscode.workspace.getConfiguration("brainz");
  const apiKey = config && config.get("poeditorApiKey");
  const projectId = 305197;
  const defaultLang = "cs";

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
              language: defaultLang,
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
}

module.exports = {
  postKeyVal
};
