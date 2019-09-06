const replace = require("replace-in-file");
const path = require("path");
const { version } = require("../package.json");
const { spawnSync } = require("child_process");

const spawnOptions = {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  encoding: "utf-8"
};
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

module.exports = class {
  constructor(appName) {
    this.appName = appName;
  }

  create() {
    console.log(`\nCameron v${version} ready! Let's build your app...`);

    this.copyTemplates();
    this.initApp();
    this.addPackages();
    this.addScripts();
    this.build();
    this.gitInit();

    this.postInstall();
  }

  copyTemplates() {
    this.sectionTitle("Creating directory structure...");

    const { status } = spawnSync("cp", ["-Rv", "templates", `${this.appName}`], spawnOptions);

    if (status) {
      this.rollback(`Could not copy templates to target directory ${this.appName}`);
    } else {
      this.replaceAppName();
    }
  }

  initApp() {
    this.sectionTitle("Initializing package.json...");

    const { status } = spawnSync("yarn", ["-yp", "--cwd", this.appName, "init"], spawnOptions);

    if (status) {
      this.rollback("Could not execute 'init' command");
    }
  }

  addPackages() {
    this.sectionTitle("Adding libraries...");

    const { status } = spawnSync(
      "yarn",
      ["--cwd", this.appName, "add", ...npmPackages],
      spawnOptions
    );

    if (status) {
      this.rollback("Could not execute 'add' command");
    }
  }

  addScripts() {
    this.sectionTitle("Adding some build scripts...");

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
      this.rollback(err);
    }

    console.log("  yarn start");
    console.log("  yarn build");
    console.log("  yarn serve");
    console.log("  yarn watch");
  }

  build() {
    this.sectionTitle("Running first build...");

    const { status } = spawnSync("yarn", ["--cwd", this.appName, "build"], spawnOptions);

    if (status) {
      this.rollback("Could not execute 'build' script");
    }
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
      this.rollback(err);
    }
  }

  postInstall() {
    this.sectionTitle("Done!");

    console.log("First let's change to the directory where your app now lives:\n");
    console.log(`  cd ${this.appName}\n`);
    console.log("Then, let's start a web server and get coding:\n");
    console.log("  yarn start\n");
    console.log("The page that opens in your browser will help get you started. Happy coding!\n");
  }

  rollback(err) {
    this.sectionTitle("There was a problem creating your app :(");

    console.error(`  ${err}`);
    console.error("\nCleaning up...");
    spawnSync("rm", ["-rf", this.installDir], spawnOptions);
    console.error("\nExiting\n");
    process.exit(1);
  }

  sectionTitle(message) {
    console.log("\n---------------------------------");
    console.log(`${message}`);
    console.log("---------------------------------\n");
  }

  get installDir() {
    return path.resolve(__dirname, "..", this.appName);
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
};
