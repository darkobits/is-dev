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
export function isDev(path) {
  try {
    // This will always be our package's root, which may exist as a sibling of
    // our direct consumer in some other package's node_modules folder.
    const ourRoot = findRoot(__dirname);
    const ourName = require(resolve(ourRoot, 'package.json')).name;
    log.silly(LOG_LABEL, `"${ourName}" root: ${ourRoot}`);

    log.silly(LOG_LABEL, 'PACKAGE NAME:', process.env.npm_package_name);

    log.silly(LOG_LABEL, path ? `Using provided path: "${path}"` : `Using caller path: "${callerPath()}"`);

    // This will resolve to the same directory as above when this package is
    // being developed locally. It will be our dependent's root directory when
    // they are being developed locally.
    const dependentRoot = findRoot(path || callerPath());

    const dependentName = require(resolve(dependentRoot, 'package.json')).name;

    if (dependentName === ourName) {
      // We were called from somewhere within this package. Bail.
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

    // Determine if the host package is a Lerna project, meaning our dependent
    // is nested in a "packages" folder and the "host" is actually the private
    // root package in the monorepo.
    const hostIsLernaProject = existsSync(resolve(hostRoot, 'lerna.json'));

    if (hostIsLernaProject) {
      log.silly(LOG_LABEL, `"${dependentName}" is being installed by "${hostName}" in a Lerna project.`);
      return true;
    }

    // const hostIsYarnProject = existsSync(resolve(hostRoot, 'yarn.lock'));

    // if (hostIsYarnProject) {
    //   log.silly(LOG_LABEL, `"${dependentName}" is being installed by "${hostName}" in a Yarn project.`);
    //   return true;
    // }

    // const hostIsNpm5Project = existsSync(resolve(hostRoot, 'package-lock.json'));

    // if (hostIsNpm5Project) {
    //   log.silly(LOG_LABEL, `"${dependentName}" is being installed by "${hostName}" in an NPM 5 project.`);
    //   return true;
    // }

    log.silly(LOG_LABEL, `"${hostName}" root: ${hostRoot}`);
    log.verbose(LOG_LABEL, `"${dependentName}" is being installed by "${hostName}".`);
    return false;
  } catch (err) {
    log.error(LOG_LABEL, err.message);
    throw err;
  }
}


export default isDev();
