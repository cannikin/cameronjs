#!/usr/bin/env node

const CameronJS = require("./lib/cameron_js");

require("yargs") // eslint-disable-line
  .command(
    "create [name]",
    "Creates a new CameronJS app",
    yargs => {
      yargs.positional("name", {
        describe: "Name of your app (should not contain spaces)"
      });
    },
    argv => {
      new CameronJS(argv.name).create();
    }
  )
  .command(
    "destroy [name]",
    "Removes a CameronJS app",
    yargs => {
      yargs.positional("name", {
        describe: "Name of your existing app"
      });
    },
    argv => {
      new CameronJS(argv.name).destroy();
    }
  )
  .command(
    "dev",
    "Start a web server and watch codebase for changes",
    () => {},
    argv => {
      CameronJS.dev();
    }
  )
  .command(
    "build",
    "Builds production-ready assets into /public",
    () => {},
    argv => {
      CameronJS.build();
    }
  )
  .command(
    "serve",
    "Starts a web server to serve the /public directory",
    () => {},
    argv => {
      CameronJS.serve();
    }
  )
  .command(
    "netlify",
    "Starts a netlify dev instance for local testing of functions",
    () => {},
    argv => {
      CameronJS.netlify();
    }
  ).argv;
