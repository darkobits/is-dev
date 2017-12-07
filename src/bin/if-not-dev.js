#!/usr/bin/env node

import execa from 'execa';
import isDev from '../index';


(async function () {
  if (!isDev()) {
    await execa.shell(process.argv.slice(2).join(' '), {
      stdio: 'inherit'
    });
  }
})();
