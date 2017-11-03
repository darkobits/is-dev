/* eslint-disable unicorn/no-process-exit */

import spawn from 'cross-spawn-promise';
import IS_DEV from '../lib/is-dev';
import log from '../lib/log';

const LOG_LABEL = 'ifDev';

export default async function (invert) {
  const [,, command, ...args] = process.argv;
  const commandStr = `${command} ${args.join(' ')}`;

  if (invert ? !IS_DEV : IS_DEV) {
    if (command) {
      log.verbose(LOG_LABEL, `Executing "${commandStr}"`);

      process.exit(await spawn(command, args, {
        encoding: 'utf8',
        shell: process.env.SHELL,
        stdio: 'inherit'
      }));
    } else {
      log.warn(LOG_LABEL, 'No command provided.');
    }
  } else {
    log.verbose(LOG_LABEL, `Not executing "${commandStr}"`);
  }
}
