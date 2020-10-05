#!/usr/bin/env node

import meow from "meow";

const packageName = "snippet-maker";

const cli = meow(
  `
	Usage
	  $ ${packageName}
`,
  {}
);

async function run() {
  if (cli.input[0] === 'make') {

  }
  if (cli.input[0] === 'process') {
    console.log('Processing')
  }
}

run();
