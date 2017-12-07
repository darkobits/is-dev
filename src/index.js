import Log from '@darkobits/log';
import isGlobal from 'is-installed-globally';


const log = new Log('is-dev');


export default function isDev() {
  if (isGlobal) {
    log.verbose('global', 'Package is a global dependency.');
    return false;
  } else if (process.cwd().indexOf('node_modules') === -1) {
    log.verbose('dev', 'Package is the host.');
    return true;
  }

  log.verbose('not-dev', 'Package is a dependency.');
  return false;
}
