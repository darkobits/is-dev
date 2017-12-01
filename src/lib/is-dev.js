import {resolve} from 'path';
import callerPath from 'caller-path';

/**
 * This function operates under the assumption that if the path to a file
 * contains "node_modules", then the calling module is acting as a dependency of
 * another module. If the path does not contain "node_modules", then the calling
 * module is the host package.
 *
 * @param  {string}  [path] - Optional path (used internally). If not provided,
 *   the path to the file calling this function will be used.
 * @return {Boolean} - Returns true if the calling module is the host (ie:
 *   cloned and set up via "npm install") and false if the calling module is a
 *   dependency (ie: set up via "npm install some-module").
 */
export default function isDev(path) {
  return String(path ? resolve(path) : callerPath()).indexOf('node_modules') === -1;
}
