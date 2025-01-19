import yargs from 'yargs'
import { DEFAULT_TRACKER, BIN_NAME, CONFIG_FILE_NAMES } from './consts'
import { findUpMany } from './lib/findup'
import { readFile } from 'fs/promises'
import { crawl } from './commands/crawl'

export const cli = async (...argv: any[]) => {
    const configPath = process.env.CATARCH_CONFIG || await findUpMany(CONFIG_FILE_NAMES)
    const config = configPath ? JSON.parse(await readFile(configPath, 'utf-8')) : {}

    return yargs(argv)
        .config(config)
        .command(['$0', 'crawl'], 'Crawl the CAT Force tracker', (yargs) => {
            yargs.option('tracker', {
                alias: 't',
                default: DEFAULT_TRACKER,
                describe: 'Tracker to crawl',
                type: 'string',
                demandOption: true
            })
        }, crawl)
        .command('list', 'List the trackers entries', (yargs) => {
            yargs.option('tracker', {
                alias: 't',
                default: DEFAULT_TRACKER,
                describe: 'Tracker to list',
                type: 'string',
                demandOption: true
            })
        })
        .command('search', 'Search the trackers entries', (yargs) => {
            yargs.option('tracker', {
                alias: 't',
                default: DEFAULT_TRACKER,
                describe: 'Tracker to search',
                type: 'string',
                demandOption: true
            })
            yargs.option('query', {
                alias: 'q',
                describe: 'Query to search',
                type: 'string',
                demandOption: true
            })
        })
        .command('serve', 'Serve / Mirror the tracker', (yargs) => {
            yargs.option('tracker', {
                alias: 't',
                default: DEFAULT_TRACKER,
                describe: 'Tracker to serve',
                type: 'string',
                demandOption: true
            })
        })
        .help()
        .completion()
        .scriptName(BIN_NAME)
        .parse(argv)
}
