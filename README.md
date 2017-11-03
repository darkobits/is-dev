[![][npm-img]][npm-url] [![][travis-img]][travis-url] [![][david-img]][david-url] [![][david-dev-img]][david-dev-url] [![][cc-img]][cc-url] [![][xo-img]][xo-url]

# is-dev

This package provides a way to determine if your package is being installed locally (ex: `npm install`) or by another package (ex: `npm install <your package>`).

## Installation

```bash
$ npm install @darkobits/is-dev
```

## Usage

This package exports a constant and provides two executables: `if-dev` and `if-not-dev`.

### Constant

> `postinstall.js`

```js
import IS_DEV from '@darkobits/is-dev';

if (IS_DEV) {
  // Package is being installed locally, for development.
} else {
  // Package is being installed by another package.
}
```

### Executables

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

`if-not-dev` is the inverse of `if-dev`.

## Use Cases

NPM runs the following [lifecycle scripts](https://docs.npmjs.com/misc/scripts) (among others) in the following order:

|Script|Runs|Typical Use Case|
|---|---|---|
|`install`|Always|Set up package for use by consuming packages.|
|`postinstall`|Always|See above.|
|`prepare`|Development (`npm install`) Only|Generate package's build artifacts.|

Because modern JavaScript projects have begun to rely heavily on transpilation, this order of execution is less than ideal, because if we are developing a package that uses a `postinstall` script that must be transpiled, it will not be built when the `install` and `postinstall` lifecycle scripts are run.

Take the following `package.json` snippet, for example:

```json
{
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "babel src --out-dir dist",
    "prepare": "npm run build",
    "postinstall": "./dist/bin/postinstall.js"
  }
}
```

This will work fine for consumers of our package, who will _only_ be downloading our build artifacts (re: `dist`). But when we try to run `npm install` for this package locally, we will get an error, because the package has not been **prepared** yet, and our `dist` folder does not exist.

We can use the `if-dev` executable to address this problem:

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

This will ensure that for local development, the package is prepared **before** we try to execute `postinstall.js`. When the package is being installed by consumers, `if-dev` will simply no-op and `postinstall.js` will be run immediately.

<p align="center">
  <br>
  <img width="22" height="22" src="https://user-images.githubusercontent.com/441546/32366171-339ec368-c03a-11e7-854a-48ee2e06961d.png">
  <br>
  <br>
</p>

> **Wont this result in "prepare" being executed twice?**
>
> Yes. However, this is probably a fair trade-off given the alternative.

Furthermore, it may be the case that we don't want to perform our `postinstall` routine(s) _at all_ when developing locally. In this case, we can use `if-not-dev` to gate the entire `postinstall` script:

> `package.json`

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "prepare": "npm run build",
    "postinstall": "if-not-dev ./dist/postinstall.js"
  }
}
```

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
