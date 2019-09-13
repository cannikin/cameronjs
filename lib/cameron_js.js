const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");
const { version } = require("../package.json");
const { spawnSync } = require("child_process");

const spawnOptions = {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  encoding: "utf-8"
};
const localPackages = [
  "@fullhuman/postcss-purgecss",
  "autoprefixer",
  "cameronjs-html-webpack-plugin",
  "postcss-cli",
  "postcss-import",
  "postcss-nested",
  "stimulus",
  "tailwindcss",
  "webpack",
  "webpack-cli"
];
const devPackages = ["del-cli", "live-server"];
const colors = {
  red: "\x1b[31m%s\x1b[0m",
  green: "\x1b[32m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
  blue: "\x1b[34m%s\x1b[0m",
  magenta: "\x1b[35m%s\x1b[0m",
  cyan: "\x1b[36m%s\x1b[0m",
  white: "\x1b[37m%s\x1b[0m"
};

module.exports = class {
  static dev() {
    spawnSync("yarn", ["dev"], spawnOptions);
  }

  static build() {
    spawnSync("yarn", ["build"], spawnOptions);
  }

  static serve() {
    spawnSync("yarn", ["serve"], spawnOptions);
  }

  static netlify() {
    spawnSync("yarn", ["netlify"], spawnOptions);
  }

  constructor(appPath) {
    this.appPath = appPath;
    this.appName = path.basename(this.appPath);
  }

  async create() {
    if (fs.existsSync(this.appPath)) {
      console.log(`\nDirectory ${this.appPath} already exists!\n`);
      process.exit(1);
    }

    console.log();
    console.log("\x1b[32m%s\x1b[0m", `CameronJS v${version} ready! Let's build your app...`);

    await this.sleep(1000);

    try {
      await this.copyTemplates();
      await this.initApp();
      await this.addPackages();
      await this.addScripts();
      await this.build();
      await this.gitInit();
    } catch (err) {
      await this.rollback(err);
    }

    this.postInstall();
  }

  async copyTemplates() {
    await this.sectionTitle("Creating directory structure...");

    const { status } = spawnSync("cp", ["-Rv", this.templatesPath, this.appPath], spawnOptions);

    if (status) {
      throw new Error(`Could not copy templates to target directory ${this.appPath}`);
    } else {
      this.replaceAppName();
    }
  }

  async initApp() {
    await this.sectionTitle("Initializing package.json...");

    const { status } = spawnSync("yarn", ["-yp", "--cwd", this.appPath, "init"], spawnOptions);

    if (status) {
      throw new Error("Could not execute 'init' command");
    }
  }

  async addPackages() {
    // await this.addDevPackages();
    await this.addLocalPackages();
  }

  async addLocalPackages() {
    await this.sectionTitle("Adding local packages...");

    const { status } = this.addPackageGroup(localPackages.concat(devPackages), "add");

    if (status) {
      throw new Error("Could not execute 'add' command for local packages");
    } else {
      console.log(`  Added ${this.localPackages}`);
    }
  }

  async addDevPackages() {
    await this.sectionTitle("Adding dev packages...");

    const { status } = this.addPackageGroup(devPackages, "add");

    if (status) {
      throw new Error("Could not execute 'add' command for dev packages");
    } else {
      console.log(`  Added ${this.devPackages}`);
    }
  }

  async addPackageGroup(packages) {
    let args = ["--cwd", this.appPath, "add", ...packages];

    console.log(`  Running yarn ${args.join(" ")}`);

    const { status } = spawnSync("yarn", args, spawnOptions);

    return status;
  }

  async addScripts() {
    await this.sectionTitle("Adding some build scripts...");

    replace.sync({
      files: [path.join(this.appPath, "package.json")],
      from: '"main"',
      to: '"scripts"'
    });
    replace.sync({
      files: [path.join(this.appPath, "package.json")],
      from: '"index.js"',
      to: JSON.stringify(this.scripts, null, 4)
    });
    replace.sync({
      files: [path.join(this.appPath, "package.json")],
      from: "},",
      to: "  },"
    });

    for (let name in this.scripts) {
      console.log(`  npm/yarn ${name}`);
    }
  }

  async build() {
    await this.sectionTitle("Running first build...");

    const { status } = spawnSync("yarn", ["--cwd", this.appPath, "build"], spawnOptions);

    if (status) {
      throw new Error("Could not execute 'build' script");
    }
  }

  async gitInit() {
    await this.sectionTitle("Initializing git repo...");

    const { status } = spawnSync("git", ["init", this.appPath], spawnOptions);

    if (status) {
      console.warn("\x1b[31m%s\x1b[0m", "Could not run `git init` command");
    }
  }

  replaceAppName() {
    replace.sync({
      files: [path.join(this.appPath, "**", "*")],
      from: /\{\{\s*appName\s*\}\}/g,
      to: this.appName
    });
  }

  async postInstall() {
    console.log();
    console.log("\x1b[32m%s\x1b[0m", "-------------------------------------------");
    console.log();

    await this.sleep(1000);

    console.log(colors.red, "        ┌─┐┌─┐┌┬┐┌─┐┬─┐┌─┐┌┐┌ ╦╔═╗");
    console.log(colors.red, "        │  ├─┤│││├┤ ├┬┘│ ││││ ║╚═╗");
    console.log(colors.red, "        └─┘┴ ┴┴ ┴└─┘┴└─└─┘┘└┘╚╝╚═╝");

    console.log("\nLet's start a web server and get to work:\n");
    console.log(colors.blue, `  cd ${this.appPath}`);
    console.log(colors.blue, "  cameronjs dev\n");
    console.log("The page that opens in your browser will help");
    console.log("you get started. Happy coding!\n");
  }

  rollback(err) {
    this.sectionTitle("There was a problem creating your app :(", "error");

    console.group();
    console.error(`${err}`);
    console.error("\nCleaning up...");
    this.destroy();
    console.groupEnd();

    console.error(
      "Check https://github.com/cameronjs/issues to see if this has been reported already."
    );
    console.error();

    process.exit(1);
  }

  destroy() {
    spawnSync("rm", ["-rf", this.appPath], spawnOptions);
    console.log(`Removed '${this.appPath}' app\n`);
  }

  async sectionTitle(message, severity = "info") {
    const sevColor = {
      info: colors.green,
      error: colors.red
    };
    const color = sevColor[severity];

    console.log();
    console.log(color, "-------------------------------------------");
    console.log(color, `|  ${message}`);
    console.log(color, "-------------------------------------------\n");
    await this.sleep(1000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      clean: "del 'public/!(images|favicon.*)'",
      dev: "$npm_execpath serve & $npm_execpath watch",
      netlify: "$npm_execpath watch & netlify dev",
      rebuild: "$npm_execpath clean && $npm_execpath build",
      serve: "live-server --watch=./public --mount=/:./public --entry-file='public/404.html'",
      watch: `${webpackCmd} --watch & ${postcssCmd} --watch`
    };
  }
};
