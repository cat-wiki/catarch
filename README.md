# Cat Archive

The Consumer Action Taskforce Archive helps keeping track of EULA/TOS and other agreements.

This is a work in progress.

## Overview

The software works by subscribing a set of "trackers" which provide a set of links to crawl.

Each crawler result gets digitally signed and archived to keep track of changes.

We use PGP Ed25519 for signing and the Hypercore Protocol for the distributed storage.

## Quick Start (wip)

1. Install the catarch CLI:

```bash
npm install -g @cat-wiki/cli
```

2. Run the CLI:

```bash
catarch --help
```

## Development Setup

```bash
ln -s $(pwd)/bin/catarch /usr/local/bin/catarch
npm install
npm run build
catarch tracker.yml
```

## License

GPL-3.0

