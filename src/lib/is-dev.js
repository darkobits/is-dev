import {resolve} from 'path';
import findRoot from 'find-root';
import log from './log';


/**
 * Recursively searches upwards in the directory tree, stopping if a directory
 * with a package.json file is found. If one is found, then we are being
 * installed by another package. If not, this is a local install.
 *
 * @return {boolean}
 */
function isDev() {
  try {
    return !findRoot(resolve(process.cwd(), '..'));
  } catch (err) {
    log.verbose('find-root', err.message);
    return true;
  }
}


export default isDev();
