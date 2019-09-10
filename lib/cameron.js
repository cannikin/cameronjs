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
  static develop() {
    spawnSync("yarn", ["develop"], spawnOptions);
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

    console.log(`\nCameron v${version} ready! Let's build your app...`);

    try {
      this.copyTemplates();
      this.initApp();
      this.addLocalPackages();
      this.addGlobalPackages();
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

  addLocalPackages() {
    this.sectionTitle("Adding local libraries...");

    const { status } = this.addPackages("", localPackages);

    if (status) {
      this.rollback("Could not execute 'add' command");
    }
  }

  addGlobalPackages() {
    this.sectionTitle("Adding global libraries...");

    const { stderr, status } = this.addPackages("-g", globalPackages);

    if (status) {
      this.sectionTitle("Could not install global packages, continuing...", "error");
      this.netlify.message = stderr;
    } else {
      this.netlify.installed = true;
    }
  }

  addPackages(flags, packages) {
    this.sectionTitle("Adding libraries...");

    const { status } = spawnSync(
      "yarn",
      [flags, "--cwd", this.appName, "add", "--dev", ...packages],
      spawnOptions
    );

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

    if (!this.netlify.installed) {
      console.warn("NOTICE: I wasn't able to install netlify-cli:\n");
      console.warn(this.netlify.message);
      console.warn("You won't be able to test Netlify functions locally until it is installed!\n");
    }

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

  sectionTitle(message, severity = "log") {
    console.call(this, severity, "\n-------------------------------------------");
    console.call(this, severity, `  ${message}`);
    console.call(this, severity, "-------------------------------------------\n");
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
      netlify: "$npm_execpath watch & netlify dev",
      rebuild: "$npm_execpath clean && $npm_execpath build",
      serve: "live-server --watch=./public --mount=/:./public --entry-file='public/404.html'",
      watch: `${webpackCmd} --watch & ${postcssCmd} --watch`
    };
  }
};
