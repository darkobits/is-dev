import execa from 'execa';
import isDev from './is-dev';
import log from './log';


/**
 * Used by if-dev and if-not-dev to execute commands.
 *
 * @param  {boolean} invert - Whether to invert the result of IS_DEV.
 */
export default async function runCommand(invert) {
  const [,, command, ...args] = process.argv;
  const IS_DEV = isDev(process.cwd());

  if (invert ? !IS_DEV : IS_DEV) {
    try {
      await execa.shell(`${command} ${args.join(' ')}`, {
        stdio: 'inherit'
      });
    } catch (err) {
      log.error('runCommand', err.message);
      process.exit(err.code); // eslint-disable-line unicorn/no-process-exit
    }
  }
}
