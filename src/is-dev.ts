import LogFactory from '@darkobits/log';
import isGlobal from 'is-installed-globally';


const log = LogFactory({ heading: 'is-dev' });


export default function isDev() {
  if (isGlobal) {
    log.verbose('global', 'Package is a global dependency.');
    return false;
  }

  if (!process.cwd().includes('node_modules')) {
    log.verbose('dev', 'Package is the host.');
    return true;
  }

  log.verbose('not-dev', 'Package is a dependency.');
  return false;
}
