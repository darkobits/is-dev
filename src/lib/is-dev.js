import {existsSync} from 'fs';
import {resolve} from 'path';
import callerPath from 'caller-path';
import findRoot from 'find-root';
import log from './log';


const LOG_LABEL = 'isDev';


/**
 * Either the thing calling us has 1 package.json above it, or more than 1.
 *
 * if 1: the thing calling us is the root package, meaning it has no consumers and is in development
 * if more than 1:
 * - the thing calling us is now a dependency of something else, and we are not in development mode
 * - the thing calling us is inside a package in a monorepo
 */



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
    // This will always be our package's root, which may exist as a sibling of
    // our direct consumer in some other package's node_modules folder.
    const ourRoot = findRoot(__dirname);
    const ourName = require(resolve(ourRoot, 'package.json')).name;
    log.silly(LOG_LABEL, `"${ourName}" root: ${ourRoot}`);

    log.silly(LOG_LABEL, process.env);

    // This will resolve to the same directory as above when this package is
    // being developed locally. It will be our dependent's root directory when
    // they are being developed locally.
    const dependentRoot = findRoot(callerPath());

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
      log.silly(LOG_LABEL, `"${dependentName}" is being installed by "${hostName}" in a Lerna repository.`);
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
