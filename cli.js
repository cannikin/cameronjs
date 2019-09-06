#!/usr/bin/env node

const Cameron = require("./lib/cameron");

require("yargs") // eslint-disable-line
  .command(
    "create [name]",
    "Creates a new Cameron app",
    yargs => {
      yargs.positional("name", {
        describe: "Name of your app (should not contain spaces)"
      });
    },
    argv => {
      new Cameron(argv.name).create();
    }
  )
  .command(
    "destroy [name]",
    "Removes a Cameron app",
    yargs => {
      yargs.positional("name", {
        describe: "Name of your existing app"
      });
    },
    argv => {
      new Cameron(argv.name).destroy();
    }
  ).argv;
