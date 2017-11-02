import {resolve} from 'path';
import findRoot from 'find-root';
import log from './log';


/**
 * Determines if there is more than 1 package.json between us and the top-level
 * directory in the filesystem. If there is, we can assume we have been
 * installed by another package and are therefore a "development" install. If
 * not, then we can assume we are a development install.
 *
 * @return {boolean}
 */
function isDev() {
  try {
    const ourPackageJsonPath = findRoot(__dirname);
    log.silly('isDev', 'Found our package.json at:', ourPackageJsonPath);

    const cwdPackageJsonPath = findRoot(resolve(process.cwd()));
    log.verbose('isDev', 'Found CWD package.json at:', cwdPackageJsonPath);

    const hostPackageJsonPath = findRoot(resolve(cwdPackageJsonPath, '..'));
    log.verbose('isDev', 'Found host\'s package.json at:', hostPackageJsonPath);

    if (hostPackageJsonPath) {
      log.verbose('isDev', 'This is not a development install.');
      return false;
    }

    log.verbose('isDev', 'This is a development install.');
    return true;
  } catch (err) {
    log.error('isDev', err.message);
    throw err;
  }
}


export default isDev();
