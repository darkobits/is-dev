#!/usr/bin/env node

import IS_DEV from '../lib/is-dev';
import runCommand from '../lib/run-command';

(async function () {
  const [,, command, ...args] = process.argv;

  if (!IS_DEV) {
    process.exit(await runCommand(command, args));
  }
})();
