#!/usr/bin/env node

import execa from 'execa';
import isDev from '../is-dev';


async function main() {
  if (!isDev()) {
    await execa(process.argv.slice(2).join(' '), {
      stdio: 'inherit'
    });
  }
}


void main();
