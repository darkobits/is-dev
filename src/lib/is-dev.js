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
    // This will always be us.
    const ourRoot = findRoot(__dirname);
    const ourName = require(resolve(ourRoot, 'package.json')).name;
    log.silly('isDev', `"${ourName}" root: ${ourRoot}`);

    // This will be us when we are being developed locally and our dependant
    // when they are being developed locally.
    const dependantRoot = findRoot(resolve(process.cwd()));
    const dependantName = require(resolve(dependantRoot, 'package.json')).name;

    if (dependantName === ourName) {
      return true;
    }

    log.silly('isDev', `"${dependantName}" root: ${dependantRoot}`);

    // This will be falsy when our dependant is being developed locally and our
    // dependant's dependant when our dependant is being installed.
    const hostRoot = findRoot(resolve(dependantRoot, '..'));

    if (!hostRoot) {
      log.verbose('isDev', `${dependantName} is being installed locally.`);
      return true;
    }

    const hostName = require(resolve(hostRoot, 'package.json')).name;

    log.silly('isDev', `"${hostName}" root: ${hostRoot}`);
    log.verbose('isDev', `"${dependantName}" is being installed by "${hostName}".`);
    return false;
  } catch (err) {
    log.error('isDev', err.message);
    throw err;
  }
}


export default isDev();
