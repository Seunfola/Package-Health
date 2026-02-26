const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

if (!fs.existsSync('panda.config.ts')) {
  console.log('No PandaCSS config, skipping');
  process.exit(0);
}

const cmd = process.platform === 'win32' ? 'panda.cmd' : 'panda';
const result = spawnSync(cmd, ['codegen'], { stdio: 'inherit', shell: true });
process.exit(result.status ?? 1);
