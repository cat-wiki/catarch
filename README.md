# Cat Archive

> This is a work in progress ![Warning](https://img.shields.io/badge/-Warning-red) 

The Consumer Action Taskforce Archive helps keeping track of EULA/TOS and other agreements.

The main goal is to have some tooling for crawling, diffing and archiving legal documents in a way which can be integrated into the [CAT Wiki](https://wiki.rossmanngroup.com/).

[NPM](https://www.npmjs.com/package/@cat-wiki/arch)

## Overview

The software works by subscribing a set of "trackers" which provide a set of links to crawl.

Each crawler result gets digitally signed and archived to keep track of changes.

We use PGP Ed25519 for signing and the Hypercore Protocol for the distributed storage.

## Quick Start (wip)

```bash
npm install -g @cat-wiki/arch

catarch --help
```

```bash
catarch

Crawl the CAT Force tracker

Commands:
  catarch crawl       Crawl the CAT Force tracker                      [default]
  catarch list        List the trackers entries
  catarch search      Search the trackers entries
  catarch serve       Serve / Mirror the tracker
  catarch completion  generate completion script

Options:
      --version  Show version number                                   [boolean]
      --help     Show help                                             [boolean]
  -t, --tracker  Tracker to crawl
                    [string] [required] [default: "https://tracker.devcat.wiki"]
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

