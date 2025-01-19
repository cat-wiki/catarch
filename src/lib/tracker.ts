import { resolve, isAbsolute } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { URL } from 'url';
import YAML from 'yaml'
/**
 * Tracker can be a URL or a path to a file
 * https://tracker.devcat.wiki/xy.yml
 * /path/to/xy.yml
 * ./xy.yml
 * file:///path/to/xy.yml
 */
export type TrackerType = 'company' | 'government' | 'community' | 'personal' | 'other';
export type TrackerFetchSchedule = 'daily' | 'weekly' | 'monthly' | string;
export type TrackerEntryType = 'tos' | 'privacy' | 'cookie' | 'eula' | 'waranty' | 'dmca' | 'sla' | 'gdpr' | 'ccpa' | 'children_privacy' | 'marketing_policy' | 'other';
export type TrackerEntryParser = 'html' | 'pdf' | 'markdown' | 'plaintext';

export type TrackerEntry = {
    name: string;
    type: TrackerEntryType;
    language: string;
    url: string;
    selectors?: {
        content?: string;
        lastUpdated?: string;
        versionLabel?: string;
    };
    fetchSchedule?: TrackerFetchSchedule;
    location?: string;
    parser?: TrackerEntryParser;
    notes?: string;
}

export type TrackerDocument = {
    name: string;
    type: TrackerType;
    fetchSchedule: TrackerFetchSchedule;
    entries: TrackerEntry[];
    notes?: string;
}

export const loadTrackerContent = async (tracker: string) => {
    if (isAbsolute(tracker) && existsSync(tracker)) {
        return await readFile(tracker, 'utf-8');
    } else if (tracker.startsWith('http://') || tracker.startsWith('https://')) {
        const url = new URL(tracker);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            // fetch
            throw new Error('HTTP/HTTPS tracker not supported yet');
        }
    } else if (tracker.startsWith('file://')) {
        const url = new URL(tracker);
        if (url.protocol === 'file:') {
            return await readFile(url.pathname, 'utf-8');
        }
    } else {
        const cwd = process.cwd();
        const path = resolve(cwd, tracker);
        if (existsSync(path)) {
            return await readFile(path, 'utf-8');
        }
    }
    throw new Error(`Tracker not found: ${tracker}`);
}

export const validateTrackerDocumentEntry = (entry: TrackerEntry) => {
    if (!entry.name) {
        throw new Error('Missing entry name');
    }
    if (!entry.type) {
        throw new Error('Missing entry type');
    }
    if (!entry.language) {
        throw new Error('Missing entry language');
    }
    if (!entry.url) {
        throw new Error('Missing entry url');
    }
}


export const validateTrackerDocument = (doc: TrackerDocument) => {
    if (!doc.name) {
        throw new Error('Missing tracker name');
    }
    if (!doc.type) {
        throw new Error('Missing tracker type');
    }
    if (!doc.fetchSchedule) {
        throw new Error('Missing fetch schedule');
    }
    if (!doc.entries || doc.entries.length === 0) {
        throw new Error('Missing entries');
    }
    
    doc.entries.forEach(validateTrackerDocumentEntry);
}

export const parseTrackerContent = async (trackerContent: ArrayBufferLike | string): Promise<TrackerDocument[]> => {
    const content = trackerContent.toString();
    
    return YAML.parseAllDocuments(content).map(doc => {
        const data = doc.toJSON();

        try {
            validateTrackerDocument(data);
        } catch (e: any) {
            console.error(`Error in tracker document: ${e.message}`);
            console.error(JSON.stringify(data, null, 2));
            //throw e;
        }
    
        return data as TrackerDocument;
    })
}

export const loadTracker = async (tracker: string) => {
    const content = await loadTrackerContent(tracker);
    return await parseTrackerContent(content);
}