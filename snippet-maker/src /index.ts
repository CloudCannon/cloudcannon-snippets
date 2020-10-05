#!/usr/bin/env node

import meow from "meow";
import glob from "glob";

const packageName = "snippet-maker";

const cli = meow(
  `
	Usage
	  $ ${packageName}
`,
  {}
);

async function run() {
  if (cli.input[0] === "make") {
  }
  if (cli.input[0] === "process") {
    console.log("Processing snippets...");

    if (cli.flags.src) {
      glob(`${__dirname}/**/*.toml`, (err, files) => {
        files.forEach((file) => {
          console.log(file);
        });
      });
    }
  }
}

run();
