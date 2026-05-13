const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    // On Windows, npx might need shell: true to find the command
    execSync(cmd, { stdio: 'inherit', shell: true });
  } catch (err) {
    console.error(`\n❌ Command failed: ${cmd}`);
    process.exit(1);
  }
}

// Ensure we are in the server root (one level up from /scripts)
const root = path.resolve(__dirname, '..');
process.chdir(root);

console.log('--- Chestone Server Build Started ---');

// 1. Prisma Generate
run('npx prisma@6.3.0 generate');


// 2. Clean dist
if (fs.existsSync('dist')) {
  run('npx shx rm -rf dist');
} else {
  console.log('\n> dist directory does not exist, skipping clean.');
}

// 3. Compile TS
run('npx tsc');

console.log('\n✅ Build completed successfully!');
