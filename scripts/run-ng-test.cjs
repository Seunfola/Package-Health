const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const hasWatchFlag = args.some((arg) => arg.startsWith('--watch'));

if (!hasWatchFlag) {
  args.push('--watch=false');
}

if (!args.some((arg) => arg.startsWith('--browsers'))) {
  args.push('--browsers=ChromeHeadless');
}

try {
  process.env.CHROME_BIN = require('puppeteer').executablePath();
} catch (error) {
  console.error(
    'Puppeteer is required for running Angular tests in headless mode. Run: pnpm install',
  );
  process.exit(1);
}

const result = spawnSync('ng', ['test', ...args], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
