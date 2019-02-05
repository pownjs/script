[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/@pown/script.svg)](https://www.npmjs.com/package/@pown/script)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)

# Pown Script 

> **WARNING**: Work in progress.

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown) but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Invoke directly from Pown:

```sh
$ pown script
```

Otherwise, install this module locally from the root of your project:

```sh
$ npm install @pown/script --save
```

Once done, invoke pown cli:

```sh
$ ./node_modules/.bin/pown-cli script
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown script
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown script [file|script]

Simple scripting engine for automating pown commands.

Options:
  --version      Show version number  [boolean]
  --help         Show help  [boolean]
  --command, -c  Evaluate inline commands  [boolean] [default: false]
  --exit, -e     Exit immediately  [boolean] [default: false]
  --expand, -x   Expand command  [boolean] [default: false]
  --skip, -s     Skip number of lines  [number] [default: 0]
```
