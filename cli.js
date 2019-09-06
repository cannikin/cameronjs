#!/usr/bin/env node

const replace = require("replace-in-file");
const path = require("path");
const { version } = require("./package.json");
const { spawnSync } = require("child_process");
const npmPackages = [
  "@fullhuman/postcss-purgecss",
  "autoprefixer",
  "cssnano",
  "file-include-webpack-plugin",
  "live-server",
  "postcss-cli",
  "postcss-import",
  "remove-files-webpack-plugin",
  "stimulus",
  "tailwindcss",
  "webpack",
  "webpack-cli"
];

class Cameron {
  constructor(appName) {
    this.appName = appName;
  }

  create() {
    console.log(`\nCameron v${version} ready! Let's build your app...\n`);

    this.copyTemplates();
    this.initApp();
    this.addPackages();
    this.addScripts();
    this.build();
    this.gitInit();

    console.log("\nDone!\n");
    console.log("First let's change to the directory where your app now lives:\n");
    console.log(`  cd ${this.appName}\n`);
    console.log("Then, let's start a web server and get coding:\n");
    console.log("  yarn start\n");
    console.log("The page that opens in your browser will help get you started!");
  }

  copyTemplates() {
    console.log("\nCreating directory structure...\n");

    spawnSync("cp", ["-Rv", "templates", `${this.appName}`], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      encoding: "utf-8"
    });

    this.replaceAppName();
  }

  initApp() {
    console.log("\nInitializing package.json...\n");

    spawnSync("yarn", ["-yp", "--cwd", this.appName, "init"], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      encoding: "utf-8"
    });
  }

  addPackages() {
    console.log("\nAdding libraries...\n");

    spawnSync("yarn", ["--cwd", this.appName, "add", ...npmPackages], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      encoding: "utf-8"
    });
  }

  addScripts() {
    console.log("\nAdding some build scripts...\n");

    try {
      replace.sync({
        files: [path.join(this.installDir, "package.json")],
        from: '"main"',
        to: '"scripts"'
      });
      replace.sync({
        files: [path.join(this.installDir, "package.json")],
        from: '"index.js"',
        to: JSON.stringify(this.scripts, null, 4)
      });
      replace.sync({
        files: [path.join(this.installDir, "package.json")],
        from: "},",
        to: "  },"
      });
    } catch (err) {
      console.error(err);
      exit();
    }

    console.log("  yarn start");
    console.log("  yarn build");
    console.log("  yarn serve");
    console.log("  yarn watch");
  }

  build() {
    console.log("\nRunning first build...\n");

    spawnSync("yarn", ["--cwd", this.appName, "build"], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      encoding: "utf-8"
    });
  }

  gitInit() {}

  replaceAppName() {
    try {
      replace.sync({
        files: [path.join(this.installDir, "**", "*")],
        from: /\{\{appName\}\}/g,
        to: this.appName
      });
    } catch (err) {
      console.error(err);
      exit();
    }
  }

  get installDir() {
    return path.resolve(__dirname, this.appName);
  }

  get scripts() {
    const postcss =
      "postcss code/stylesheets/application.css -o public/stylesheets/application.css";

    return {
      start: "yarn serve & yarn watch",
      serve: "live-server --watch=./public --mount=/:./public",
      build: `webpack && ${postcss}`,
      watch: `webpack --watch & ${postcss} --watch`
    };
  }
}

new Cameron("blah").create();
