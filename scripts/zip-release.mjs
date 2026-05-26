import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const required = ['module.json', 'style.css', join('scripts', 'module.js'), 'templates'];

for (const file of required) {
  if (!existsSync(join(dist, file))) {
    console.error(`Missing dist/${file}. Run "npm run build" first.`);
    process.exit(1);
  }
}

const manifest = JSON.parse(readFileSync(join(dist, 'module.json'), 'utf-8'));

if (!manifest.download) {
  console.error(
    'dist/module.json has no "download" URL. Set repository in package.json or pass GH_PROJECT and GH_TAG when building.'
  );
  process.exit(1);
}

const zipPath = join(dist, 'module.zip');
const files = ['module.json', 'style.css', 'scripts', 'templates'];

try {
  execSync(`zip -r "${zipPath}" ${files.join(' ')}`, { cwd: dist, stdio: 'inherit' });
} catch {
  console.error(
    'zip command failed. On Windows, install zip (e.g. via Git for Windows) or create module.zip manually from dist/ contents.'
  );
  process.exit(1);
}

console.log(`Created ${zipPath}`);
console.log(`download: ${manifest.download}`);
