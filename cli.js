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
  )
  .command(
    "develop",
    "Start a web server and watch codebase for changes",
    () => {},
    argv => {
      Cameron.develop();
    }
  )
  .command(
    "build",
    "Builds production-ready assets into /public",
    () => {},
    argv => {
      Cameron.build();
    }
  )
  .command(
    "serve",
    "Starts a web server to serve the /public directory",
    () => {},
    argv => {
      Cameron.serve();
    }
  ).argv;
