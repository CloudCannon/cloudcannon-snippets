const toml = require("toml");
const fs = require("fs");

/* CLI markdown.config.js file example */
module.exports = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (API) --> */
    API(content, options) {
      /**
       * Generate README docs
       */
      const snippetToml = fs.readFileSync("./snippets/index.snippet.toml");

      const data = toml.parse(snippetToml);

      const categories = {};
      Object.entries(data).forEach(([key, data]) => {
        const obj = {
          prefixes: data.prefix.join("' or '"),
          description: data.description,
          category: data.category || "",
        };

        if (!categories[data.category]) {
          categories[data.category] = [obj];
        } else {
          categories[data.category].push(obj);
        }
      });

      return Object.entries(categories)
        .map(([key, data]) => {
          console.log("data", data);
          return (
            `### ${key}\n` +
            data
              .map((item) => `- **'${item.prefixes}'** - ${item.description}`)
              .join("\n")
          );
        })
        .join("\n\n");
    },
  },
  callback: function () {
    console.log("done");
  },
};
