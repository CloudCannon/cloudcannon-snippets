const toml = require("toml");
const fs = require("fs");

/* CLI markdown.config.js file example */
module.exports = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (API) --> */
    API(content, options) {
      const snippetToml = fs.readFileSync("./snippets/index.snippet.toml");

      const data = toml.parse(snippetToml);

      return Object.entries(data)
        .map(([key, data]) => ({
          prefixes: data.prefix.join("' or '"),
          description: data.description,
        }))
        .map((item) => `- **'${item.prefixes}'** - ${item.description}`).join('\n\n');
    },
  },
  callback: function () {
    console.log("done");
  },
};
