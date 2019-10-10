#!/usr/bin/env node

const CameronJS = require("./lib/cameron_js");

console.log("Try `cameronjs --help` for usage options");

require("yargs")
  .usage("Usage $0 <command> [options]")
  .command(
    "new [path]",
    "Creates a new CameronJS app",
    yargs => {
      yargs.positional("path", {
        describe: "Path to your new app (ex. ~/Sites/my_app)"
      });
    },
    argv => {
      new CameronJS(argv.path).create();
    }
  )
  .command(
    "destroy [path]",
    "Removes a CameronJS app",
    yargs => {
      yargs.positional("path", {
        describe: "Path to your existing app (ex. ~/Sites/my_app)"
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
    "Builds production-ready assets into /publish",
    () => {},
    argv => {
      CameronJS.build();
    }
  )
  .command(
    "serve",
    "Starts a web server to serve the /publish directory",
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
