import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, existsSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

await build({
  entryPoints: ['src/lambda.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'dist/lambda.js',
  minify: false,
  sourcemap: false,
  logLevel: 'info',
});

const zipCmd =
  process.platform === 'win32'
    ? `powershell -NoProfile -Command "Compress-Archive -Path dist/lambda.js -DestinationPath dist/lambda.zip -Force"`
    : `cd dist && zip -q lambda.zip lambda.js`;

execSync(zipCmd, { stdio: 'inherit' });

if (!existsSync('dist/lambda.zip')) {
  throw new Error('zip failed: dist/lambda.zip not created');
}

console.log('\nbuilt dist/lambda.zip');
