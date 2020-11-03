#!/usr/bin/env node

import meow from "meow";
import glob from "glob";
import toml from "toml";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const packageName = "snippet-maker";

const cli = meow(
  `
	Usage
	  $ ${packageName}
`,
  {}
);

/**
 * Convert toml into injestable snippets
 */
async function run() {
  if (cli.input[0] === "make") {
  } else {
    console.log("Processing snippets...");
    const srcDir = cli.flags.src ?? ".";
    const outDir: string =
      (cli.flags.outDir as string) ?? path.resolve(".", "dist");

    const files = await new Promise<Array<string>>((resolve, reject) =>
      glob(`${srcDir}/**/*.snippet.toml`, (err, files) => {
        resolve(files);
      })
    );

    if (files.length === 0) {
      console.log("Files not found!");
      return;
    }

    const snippetObj: { [T: string]: any } = {};
    for (const file of files) {
      console.log(`Processing file ${file}...`);
      const data = fs.readFileSync(file).toString();
      const mytoml = toml.parse(data);

      for (const [name, data] of Object.entries(mytoml) as Array<
        [string, Record<string, any>]
      >)
        if (data.url) {
          // If url is provided, fetch snippet as raw text from URL
          const body = await (await fetch(data.url)).text();
          snippetObj[name] = {
            ...data,
            body: body.split("\n"),
          };
        } else {
          snippetObj[name] = {
            ...data,
            body: data.body.split("\n"),
          };
        }
    }

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }
    fs.writeFileSync(
      path.resolve(outDir, "snippets.code-snippets"),
      JSON.stringify(snippetObj)
    );
    console.log("Done!");
  }
}

run();
