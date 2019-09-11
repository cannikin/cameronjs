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
const globalPackages = ["netlify-cli"];
const localPackages = [
  "@fullhuman/postcss-purgecss",
  "autoprefixer",
  "file-include-webpack-plugin",
  "postcss-cli",
  "postcss-import",
  "postcss-nested",
  "remove-files-webpack-plugin",
  "stimulus",
  "tailwindcss",
  "webpack",
  "webpack-cli"
];
const devPackages = ["del-cli", "live-server"];

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

  constructor(appName) {
    this.appName = appName;
    this.netlify = {
      installed: false,
      message: ""
    };
  }

  create() {
    if (fs.existsSync(this.installPath)) {
      console.log(`\nDirectory ${this.installPath} already exists!\n`);
      process.exit(1);
    }

    console.log(`\nCameronJS v${version} ready! Let's build your app...`);

    // try {
    this.copyTemplates();
    this.initApp();
    this.addPackages();
    this.addScripts();
    this.build();
    this.gitInit();
    // } catch (err) {
    //   this.rollback(err);
    // }

    this.postInstall();
  }

  copyTemplates() {
    this.sectionTitle("Creating directory structure...");

    const { status } = spawnSync("cp", ["-Rv", this.templatesPath, this.installPath], spawnOptions);

    if (status) {
      throw new Error(`Could not copy templates to target directory ${this.installPath}`);
    } else {
      this.replaceAppName();
    }
  }

  initApp() {
    this.sectionTitle("Initializing package.json...");

    const { status } = spawnSync("yarn", ["-yp", "--cwd", this.appName, "init"], spawnOptions);

    if (status) {
      throw new Error("Could not execute 'init' command");
    }
  }

  addPackages() {
    this.addLocalPackages();
    this.addDevPackages();
    this.addGlobalPackages();
  }

  addLocalPackages() {
    this.sectionTitle("Adding local packages...");

    const { status } = this.addPackageGroup(localPackages, "add");

    if (status) {
      throw new Error("Could not execute 'add' command for local packages");
    } else {
      console.log(`  Added ${this.localPackages}`);
    }
  }

  addDevPackages() {
    this.sectionTitle("Adding dev packages...");

    const { status } = this.addPackageGroup(devPackages, "add");

    if (status) {
      throw new Error("Could not execute 'add' command for dev packages");
    } else {
      console.log(`  Added ${this.devPackages}`);
    }
  }

  addGlobalPackages() {
    this.sectionTitle("Adding global packages...");

    const { stderr, status } = this.addPackageGroup(globalPackages, "add");

    if (status) {
      this.sectionTitle("Could not install global packages, continuing...", "error");
      this.netlify.message = stderr;
    } else {
      this.netlify.installed = true;
      console.log(`  Added ${this.globalPackages}`);
    }
  }

  addPackageGroup(packages, command, cwd = true) {
    let args = [];
    if (cwd) {
      args = args.concat(["--cwd", this.appName]);
    }
    args = args.concat([command, ...packages]);
    console.log(`  Running yarn ${args.join(" ")}`);

    const { status } = spawnSync("yarn", args, spawnOptions);

    return status;
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
      throw new Error("Could not execute 'build' script");
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

    if (!this.netlify.installed) {
      console.warn("NOTICE: I wasn't able to install netlify-cli:\n");
      console.warn(this.netlify.message);
      console.warn("You won't be able to test Netlify functions locally until it is installed!\n");
    }

    console.log("Let's start a web server and get to work:\n");
    console.log(`  cd ${this.appName}`);
    console.log("  cameronjs dev\n");
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

  sectionTitle(message, severity = "log") {
    console.info("\n-------------------------------------------");
    console.info(`  ${message}`);
    console.info("-------------------------------------------\n");
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
      dev: "$npm_execpath serve & $npm_execpath watch",
      netlify: "$npm_execpath watch & netlify dev",
      rebuild: "$npm_execpath clean && $npm_execpath build",
      serve: "live-server --watch=./public --mount=/:./public --entry-file='public/404.html'",
      watch: `${webpackCmd} --watch & ${postcssCmd} --watch`
    };
  }
};
