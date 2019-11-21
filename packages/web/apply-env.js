const fs = require('fs');
const { execSync } = require('child_process');

execSync('rm -rf ./src/.next/cache');

const findOutput = execSync(`find './src/.next/' -type f -iname '*.js'`);

const jsFiles = findOutput
  .toString()
  .split('\n')
  .filter(str => str.trim());

let updatedFilesCount = 0;

for (const fileName of jsFiles) {
  const file = fs.readFileSync(fileName, 'utf-8');

  let isUpdated = false;

  const updatedFile = file.replace(
    /\b(?:process|e)\.env\.([A-Z][A-Z0-9_]*)\b/g,
    (original, envName) => {
      if (envName === 'NODE_ENV' || envName.startsWith('WEB_')) {
        isUpdated = true;

        const value = process.env[envName] || '';

        return JSON.stringify(value);
      }

      return original;
    }
  );

  if (isUpdated) {
    updatedFilesCount += 1;
    fs.writeFileSync(fileName, updatedFile);
  }
}

// eslint-disable-next-line no-console
console.log(`Updated ${updatedFilesCount} files.`);
