import {existsSync} from 'fs';
import {resolve} from 'path';
import findRoot from 'find-root';
import log from './log';


const LOG_LABEL = 'isDev';


/**
 * - If "npm install" is run from this package, return true.
 * - If "npm install" is run from this package's direct consumer, return true.
 * - If "npm install" is run from a consumer of this package's direct consumer,
 *   return false.
 *
 * @return {boolean}
 */
function isDev() {
  try {
    // This will always be us.
    const ourRoot = findRoot(__dirname);
    const ourName = require(resolve(ourRoot, 'package.json')).name;
    log.silly(LOG_LABEL, `"${ourName}" root: ${ourRoot}`);

    // This will be us when we are being developed locally and our dependent
    // when they are being developed locally.
    const dependentRoot = findRoot(process.cwd());
    const dependentName = require(resolve(dependentRoot, 'package.json')).name;

    if (dependentName === ourName) {
      return true;
    }

    log.silly(LOG_LABEL, `"${dependentName}" root: ${dependentRoot}`);

    // This will be falsy when our dependent is being developed locally and our
    // dependent's dependent when our dependent is being installed.
    const hostRoot = findRoot(resolve(dependentRoot, '..'));

    if (!hostRoot) {
      log.verbose(LOG_LABEL, `${dependentName} is being installed locally.`);
      return true;
    }

    const hostName = require(resolve(hostRoot, 'package.json')).name;
    const hostIsLernaRepo = existsSync(resolve(hostRoot, 'lerna.json'));

    if (hostIsLernaRepo) {
      log.silly(LOG_LABEL, `"${dependentName}" is being installed by ${hostName} in a Lerna repository.`);
      return true;
    }

    log.silly(LOG_LABEL, `"${hostName}" root: ${hostRoot}`);
    log.verbose(LOG_LABEL, `"${dependentName}" is being installed by "${hostName}".`);
    return false;
  } catch (err) {
    log.error(LOG_LABEL, err.message);
    throw err;
  }
}


export default isDev();
