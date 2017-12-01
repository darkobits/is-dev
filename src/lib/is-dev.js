import {resolve} from 'path';
import callerPath from 'caller-path';
import findRoot from 'find-root';
import log from './log';


/**
 * Determines if the calling module is a "root" module (development) or a
 * dependency (production).
 *
 * @return {boolean}
 */
export default function isDev(path) {
  try {
    const dependentRoot = findRoot(path ? resolve(path) : callerPath());
    return dependentRoot.indexOf('node_modules') === -1;
  } catch (err) {
    log.error('is-dev', err.message);
    throw err;
  }
}
