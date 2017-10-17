#!/usr/bin/env node

import log from '../lib/log';
import IS_DEV from '../lib/is-dev';
import getLocalPackageJson from '../lib/get-local-package-json';
import runCommand from '../lib/run-command';


(async function () {
  try {
    const packageJson = getLocalPackageJson();

    if (IS_DEV) {
      const [,, command, ...args] = process.argv;
      const exitCode = await runCommand(command, args);
      process.exit(exitCode);
    } else {
      log.info('not-dev', `${packageJson.name} is not being installed in development mode.`);
    }
  } catch (err) {
    process.exit(1);
  }
})();
