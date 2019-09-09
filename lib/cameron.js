const replace = require("replace-in-file");
const fs = require("fs");
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
  "del-cli",
  "file-include-webpack-plugin",
  "live-server",
  "postcss-cli",
  "postcss-import",
  "postcss-nesting",
  "remove-files-webpack-plugin",
  "stimulus",
  "tailwindcss",
  "webpack",
  "webpack-cli"
];

module.exports = class {
  // starts the local live-server instance and watch process
  static develop() {
    console.log(process.cwd());
    const result = spawnSync("yarn", ["develop"], spawnOptions);
    console.log(result);
  }

  constructor(appName) {
    this.appName = appName;
  }

  create() {
    if (fs.existsSync(this.installPath)) {
      console.log(`\nDirectory ${this.installPath} already exists!\n`);
      process.exit(1);
    }

    console.log(`\nCameron v${version} ready! Let's build your app...`);

    try {
      this.copyTemplates();
      this.initApp();
      this.addPackages();
      this.addScripts();
      this.build();
      this.gitInit();
    } catch (err) {
      this.rollback(err);
    }

    this.postInstall();
  }

  copyTemplates() {
    this.sectionTitle("Creating directory structure...");

    const { status } = spawnSync("cp", ["-Rv", this.templatesPath, this.installPath], spawnOptions);

    if (status) {
      this.rollback(`Could not copy templates to target directory ${this.installPath}`);
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

    replace.sync({
      files: [path.join(this.installPath, "package.json")],
      from: '"main"',
      to: '"scripts"'
    });
    replace.sync({
      files: [path.join(this.installPath, "package.json")],
      from: '"index.js"',
      to: JSON.stringify(this.scripts, null, 4)
    });
    replace.sync({
      files: [path.join(this.installPath, "package.json")],
      from: "},",
      to: "  },"
    });

    for (let name in this.scripts) {
      console.log(`  npm/yarn ${name}`);
    }
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
    replace.sync({
      files: [path.join(this.installPath, "**", "*")],
      from: /\{\{appName\}\}/g,
      to: this.appName
    });
  }

  postInstall() {
    this.sectionTitle("Done!");

    console.log("Let's start a web server and get to work:\n");
    console.log(`  cd ${this.appName}`);
    console.log("  cameron develop\n");
    console.log("The page that opens in your browser will help get you started. Happy coding!\n");
  }

  rollback(err) {
    this.sectionTitle("There was a problem creating your app :(");

    console.error(`  ${err}`);
    console.error("\nCleaning up...");
    this.destroy();
    console.error("Exiting\n");
    process.exit(1);
  }

  destroy() {
    spawnSync("rm", ["-rf", this.installPath], spawnOptions);
    console.log(`\nRemoved '${this.appName}' app\n`);
  }

  sectionTitle(message) {
    console.log("\n-------------------------------------------");
    console.log(`  ${message}`);
    console.log("-------------------------------------------\n");
  }

  get installPath() {
    return path.resolve(".", this.appName);
  }

  get templatesPath() {
    return path.resolve(__dirname, "..", "templates");
  }

  get scripts() {
    const postcssCmd =
      "postcss --verbose code/stylesheets/application.pcss -o public/stylesheets/application.css";
    const webpackCmd = "webpack";

    return {
      build: `${webpackCmd} && ${postcssCmd}`,
      clean: "del 'public/!(images)'",
      develop: "$npm_execpath serve & $npm_execpath watch",
      rebuild: "$npm_execpath clean && $npm_execpath build",
      serve: "live-server --watch=./public --mount=/:./public",
      watch: `${webpackCmd} --watch & ${postcssCmd} --watch`
    };
  }
};
