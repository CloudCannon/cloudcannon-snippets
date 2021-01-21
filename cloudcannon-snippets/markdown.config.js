const toml = require("toml");
const fs = require("fs");
const path = require("path");

/* CLI markdown.config.js file example */
module.exports = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (API) --> */
    API(content, options) {
      /**
       * Generate README docs
       */

      const files = fs
        .readdirSync("./snippets/")
        .filter((file) => file.includes(".toml"));

      const array = files.reduce((acc, file) => {
        const snippetToml = fs.readFileSync(
          path.resolve(__dirname, "./snippets", file)
        );

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

        return [
          ...acc,
          ...Object.entries(categories)
            .map(([key, data]) => {
              return (
                `### ${key}\n` +
                data
                  .map(
                    (item) => `- **'${item.prefixes}'** - ${item.description}`
                  )
                  .join("\n")
              );
            })
        ];
      }, []);

      return array.join('\n\n');
    },
  },
  callback: function () {
    console.log("done");
  },
};
