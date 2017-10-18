[![][npm-img]][npm-url] [![][travis-img]][travis-url] [![][david-img]][david-url] [![][david-dev-img]][david-dev-url] [![][cc-img]][cc-url] [![][xo-img]][xo-url]

# is-dev

This package provides a way to determine if your package is being installed locally or by another package.

## Installation

```bash
$ yarn add @darkobits/is-dev
```

or

```bash
$ npm install --save @darkobits/is-dev
```

## Usage

This package exports a predicate constant and a binary, `if-dev`.

### Predicate

> `postinstall.js`

```js
import IS_DEV from '@darkobits/is-dev';

if (IS_DEV) {
  // Package is being installed locally, for development.
} else {
  // Package is being installed by another package.
}
```

### Binary

`if-dev` checks if the package has been installed locally or by another package. If it was installed locally, it will run the provided command.

> `package.json`

```json
{
  "scripts": {
    "bar": "cowsay 'Moo!'",
    "foo": "if-dev npm run bar"
  }
}
```

## Use Case

NPM runs the following [lifecycle scripts](https://docs.npmjs.com/misc/scripts) (among others) in the following order:

|Script|Runs On Install Type|Typical Use Case|
|---|---|---|
|`install`|Local & Development|Set up package for use by consuming packages.|
|`postinstall`|Local & Development|See above.|
|`prepare`|Development Only|Generate package's build artifacts.|

This is sub-optimal, because it leaves developers with no way to generate build artifacts on local installations before they need to be used by `install` / `postinstall` scripts.

We can use the `if-dev` binary to address this problem:

> `package.json`

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "prepare": "npm run build",
    "postinstall": "if-dev npm run prepare && ./dist/postinstall.js"
  }
}
```

With the above setup, we can guarantee that the package's build artifacts will be generated before `postinstall.js` runs, and `if-dev` will pass when the package is being installed as a dependency.

## Caveats

With the above configuration, your package's `prepare` script _will_ run twice (both before and after `postinstall`). This will add a small amount of time to `npm install`, but ensures a clean, error-free installation.

## &nbsp;
<p align="center">
  <br>
  <img width="22" height="22" src="https://cloud.githubusercontent.com/assets/441546/25318539/db2f4cf2-2845-11e7-8e10-ef97d91cd538.png">
</p>

[npm-img]: https://img.shields.io/npm/v/@darkobits/is-dev.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@darkobits/is-dev

[travis-img]: https://img.shields.io/travis/darkobits/is-dev.svg?style=flat-square
[travis-url]: https://travis-ci.org/darkobits/is-dev

[david-img]: https://img.shields.io/david/darkobits/is-dev.svg?style=flat-square
[david-url]: https://david-dm.org/darkobits/is-dev

[david-dev-img]: https://img.shields.io/david/dev/darkobits/is-dev.svg?style=flat-square
[david-dev-url]: https://david-dm.org/darkobits/is-dev?type=dev

[cc-img]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square
[cc-url]: https://github.com/conventional-changelog/standard-version

[xo-img]: https://img.shields.io/badge/code_style-XO-e271a5.svg?style=flat-square
[xo-url]: https://github.com/sindresorhus/xo
