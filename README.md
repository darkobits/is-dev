<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/118932597-10060a00-b8fd-11eb-94c5-b6e276976a5d.png" style="max-width: 100%;">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/is-dev"><img src="https://img.shields.io/npm/v/@darkobits/is-dev.svg?style=flat-square"></a>
  <a href="https://github.com/darkobits/is-dev/actions"><img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fdarkobits%2Fis-dev%2Fbadge%3Fref%3Dmaster&style=flat-square&label=build&logo=none"></a>
  <!-- <a href="https://app.codecov.io/gh/darkobits/is-dev/branch/master"><img src="https://img.shields.io/codecov/c/github/darkobits/is-dev/master?style=flat-square"></a> -->
  <a href="https://depfu.com/github/darkobits/is-dev"><img src="https://img.shields.io/depfu/darkobits/is-dev?style=flat-square"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/static/v1?label=commits&message=conventional&style=flat-square&color=398AFB"></a>
</p>

This package provides a way to determine if your package is being installed locally (ex: `npm install`)
or by another package (ex: `npm install <your package>`).

## Installation

```sh
$ npm install @darkobits/is-dev
```

## Usage

This package is designed to be used as part of a lifecycle script or in files that run during lifecycle
scripts. It provides a function, `isDev`, and two binaries, `if-dev` and `if-not-dev`.

### `isDev(): boolean`

Returns `true` if the package is the host package, `false` if it is a dependency or if the package is
installed globally.

> `postinstall.js`

```js
import isDev from '@darkobits/is-dev';

if (isDev()) {
  // This package is the host package.
} else {
  // This package is a dependency.
}
```

### Binaries

`if-dev` checks if the package is the host package. If it is, the provided command will be executed.

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

NPM runs the following [lifecycle scripts](https://docs.npmjs.com/misc/scripts) (among others) in the
following order:

| Script        | Runs                             | Typical Use Case                              |
|---------------|----------------------------------|-----------------------------------------------|
| `install`     | Always                           | Set up package for use by consuming packages. |
| `postinstall` | Always                           | See above.                                    |
| `prepare`     | Development (`npm install`) Only | Generate package's build artifacts.           |

Because modern JavaScript projects have begun to rely heavily on transpilation, this order of execution
is less than ideal. If, for example, we are developing a package that uses a `postinstall` script that
must be transpiled, it will not have been built when the `install` and `postinstall` lifecycle scripts
are run.

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

This will work fine for consumers of our package, who will _only_ be downloading our build artifacts
(re: `dist`). But when we try to run `npm install` when this package is the host, we will get an error,
because the package has not been **prepared** yet, and our `dist` folder does not exist.

We can use `if-dev` to address this problem:

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

This will ensure that for local development, the package is prepared **before** we try to execute
`postinstall.js`. When the package is being installed by consumers, `if-dev` will simply no-op and
`postinstall.js` will be run immediately.

---

Alternatively, imagine we have a `postinstall` script that we don't want to run during local
development. We can use `if-not-dev` to no-op the `postinstall` script/command unless the package is
being installed by a consumer:

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "prepare": "npm run build",
    "postinstall": "if-not-dev ./dist/postinstall.js"
  }
}
```

<a href="#top">
  <img src="https://user-images.githubusercontent.com/441546/118062198-4ff04e80-b34b-11eb-87f3-406a345d5526.png" style="max-width: 100%;">
</a>
