import {resolve} from 'path';
import log from './log';


/**
 * Loads the package.json file for the package executing this binary.
 *
 * @return {object}
 */
export default function getLocalPackageJson() {
  try {
    const packageJsonPath = resolve(process.cwd(), 'package.json');
    log.verbose('manifest', `Attempting to load "${packageJsonPath}".`);
    return require(packageJsonPath);
  } catch (err) {
    log.error('manifest', 'Failed to load "package.json":', err.message);
    throw err;
  }
}
