Ethereum Bad Block Reporting
============
[![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url]

This is a visual interface for tracking ethereum network status. It uses WebSockets to receive stats from running nodes and output them through an angular interface. It is the front-end implementation for [eth-net-intelligence-api](https://github.com/cubedro/eth-net-intelligence-api).

![Screenshot](https://raw.githubusercontent.com/cubedro/badblock.ethdev.com/master/src/images/screenshot.jpg "Screenshot")

## Prerequisite
* node
* npm

## Installation
Make sure you have node.js and npm installed.

Clone the repository and install the dependencies

```bash
git clone https://github.com/cubedro/badblock.ethdev.com
cd badblock.ethdev.com
npm install
```

##Run

```bash
npm start
```

see the interface at http://localhost:3000

[travis-image]: https://travis-ci.org/cubedro/badblock.ethdev.com.svg
[travis-url]: https://travis-ci.org/cubedro/badblock.ethdev.com
[dep-image]: https://david-dm.org/cubedro/badblock.ethdev.com.svg
[dep-url]: https://david-dm.org/cubedro/badblock.ethdev.com