/* eslint-disable no-underscore-dangle */

// eslint-disable-next-line import/no-mutable-exports
let env;

if (process.browser) {
  env = window.__env || {};
  delete window.__env;
} else {
  env = {};

  for (const [keyName, value] of Object.entries(process.env)) {
    if (keyName.startsWith('WEB_') && !keyName.endsWith('_')) {
      env[keyName] = value;
    }
  }
}

module.exports = env;
