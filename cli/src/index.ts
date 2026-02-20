#!/usr/bin/env node
import { createProject } from './template.js';
import { isCommandAvailable } from './utils.js';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get package.json for version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = await fs.readJson(packageJsonPath);

const program = new Command();

program
  .name('create-next-claude-app')
  .description('Create a new Next.js project with Feature-Sliced Design architecture')
  .option('-v, --version', 'Output version and environment info')
  .argument('[project-name]', 'Name of the project to create')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .action(async (projectName: string | undefined, options: any) => {
    if (options.version) {
      const hasPnpm = await isCommandAvailable('pnpm');
      const hasGit = await isCommandAvailable('git');

      console.log();
      console.log(chalk.bold.cyan('create-next-claude-app') + chalk.white(` v${packageJson.version}`));
      console.log();
      console.log(chalk.gray('  Node.js  ') + process.version);
      console.log(chalk.gray('  OS       ') + `${os.platform()}-${os.arch()}`);
      console.log(chalk.gray('  pnpm     ') + (hasPnpm ? chalk.green('available') : chalk.yellow('not found')));
      console.log(chalk.gray('  git      ') + (hasGit ? chalk.green('available') : chalk.yellow('not found')));
      console.log();
      return;
    }

    console.log();
    console.log(chalk.bold.cyan('create-next-claude-app') + chalk.gray(' v' + packageJson.version));
    console.log();

    try {
      await createProject({
        projectName,
        install: options.install,
        git: options.git,
      });
    } catch (error) {
      console.error(chalk.red('Failed to create project'));
      process.exit(1);
    }
  });

program.on('--help', () => {
  console.log();
  console.log('Examples:');
  console.log('  $ npx create-next-claude-app my-app');
  console.log('  $ npx create-next-claude-app my-app --no-install');
  console.log('  $ npx create-next-claude-app my-app --no-git');
  console.log();
});

program.parse(process.argv);
