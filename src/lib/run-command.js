import spawn from 'cross-spawn';
import log from './log';


/**
 * Executes the provided command.
 *
 * @param  {string} command
 * @param  {array} args
 * @return {promise}
 */
export default async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    log.info('run', `Running command "${command} ${args.join(' ')}".`);

    const child = spawn(command, args, {stdio: 'inherit'});

    function onError(err) {
      log.error('spawn', `Encountered an error while trying to run "${command}":`, err.message);
      reject(err);
    }

    child.on('error', onError);
    child.on('uncaughtException', onError);
    child.on('exit', resolve);
  });
}
