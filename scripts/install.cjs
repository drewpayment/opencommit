const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function isPnpmAvailable() {
  try {
    // Try to execute 'pnpm --version'
    spawnSync('pnpm', ['--version'], { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

const outDirPath = path.resolve(__dirname, '../out');

try {
  execSync(`npm pack --pack-destination ${outDirPath}`);
  
  console.log(`\n*****\n[STEP 1] Package packed successfully...\n*****\n`);
} catch (error) {
  console.log(`[ERROR] An error occurred during installation: ${error}`);
  process.exit(1);
}

// find a file in ./out folder named like opencommit-***.tgz
const files = fs.readdirSync(outDirPath);
let packageFilePath = '';

for (let i = 0; i < files.length; i++) {
  console.log(`[DEBUG] Found file #${i}: ${files[i]}`)
  if (files[i].startsWith('opencommit-')) {
    packageFilePath = files[i];
    break;
  }
}

if (!packageFilePath) {
  console.log('[ERROR] Cannot find a package file in ./out folder. Please confirm your opencommit-xxx.tgz file is in ./out folder.');
  process.exit(1); // Exit with an error code
}

const installPath = path.join(outDirPath, packageFilePath);

// Construct the installation command
const installCommand = isPnpmAvailable()
  ? `pnpm add -g ${installPath}`
  : `npm install -g ${installPath}`;

try {
  // Execute the command synchronously
  execSync(installCommand, { stdio: 'inherit' });
  
  console.log(`\n*****\n[STEP 2] Package '${packageFilePath}' installed successfully!\n*****\n`);
  console.log(`[INFO] You can now use 'opencommit' command to start using OpenCommit.`);
  
  process.exit(0);
} catch (error) {
  console.log('[ERROR] An error occurred during installation:', error);
  
  process.exit(1);
}