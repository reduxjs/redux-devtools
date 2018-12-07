const path = require("path");
const { readdirSync, statSync } = require('fs');
const { execSync } = require("child_process");

const execArgs = { stdio: "inherit", env: process.env };
const command = process.argv.slice(2).join(' ');

const getDirectories = srcPath => readdirSync(srcPath)
  .filter(file => statSync(path.join(srcPath, file)).isDirectory());

if (!command) {
  console.error('No command specified.')
} else {
  const cwd = process.cwd();
  getDirectories('packages').forEach(packageName => {
    console.log(packageName, path.resolve(__dirname, "../packages/" + packageName));
    process.chdir(path.resolve(__dirname, "../packages/" + packageName));
    execSync(command, execArgs);
  });
  process.chdir(cwd);
}
