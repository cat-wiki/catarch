import { loadTracker } from "@/lib/tracker"
import type { TrackerDocument, TrackerEntry } from "@/lib/tracker"
import pdfParse from 'pdf-parse'
import * as cheerio from 'cheerio'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export const crawl = async (argv: any) => {
    const tracker = await loadTracker(argv.tracker)

    console.log(`Crawling ${tracker.length} documents from ${argv.tracker}`)

    for (const doc of tracker) {
        await crawlTrackerDocument(doc)
    }
}

export const crawlTrackerDocument = async (doc: TrackerDocument) => {
    console.log(`Crawling ${doc.name}`)

    for (const entry of doc.entries) {
        await crawlTrackerEntry(entry)
    }
}

async function fetchContent(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch URL ${url}: ${res.status} ${res.statusText}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

export const crawlTrackerEntry = async (entry: TrackerEntry) => {
    console.log(`Crawling entry: ${entry.name} [${entry.url}]`);

    // 1. Download
    let buffer: Buffer;
    try {
        buffer = await fetchContent(entry.url);
    } catch (err: any) {
        console.error(`Failed to download ${entry.name}:`, err.message);
        return;
    }

    // Determine the parser (default to HTML if none specified)
    const parserType = entry.parser || 'html';

    // 2. Parse
    let extractedText = '';
    try {
        if (parserType === 'pdf') {
            // PDF parsing
            const pdfData = await pdfParse(buffer);
            extractedText = pdfData.text;
        } else if (parserType === 'html') {
            // HTML parsing
            const html = buffer.toString('utf-8');
            const $ = cheerio.load(html);

            // If we have selectors, we can do some extraction
            if (entry.selectors) {
                const { content, lastUpdated, versionLabel } = entry.selectors;

                const contentHtml = content ? $(content).html() : '';
                const lastUpdatedText = lastUpdated ? $(lastUpdated).text() : '';
                const versionLabelText = versionLabel ? $(versionLabel).text() : '';

                if (!contentHtml) {
                    throw new Error('Content selector not found');
                }

                const contentDom = new JSDOM(contentHtml);
                const reader = new Readability(contentDom.window.document);
                const article = reader.parse();


                // For demonstration, just concatenate them
                extractedText = `
            Content:\n${article?.textContent}\n
            Last Updated:\n${lastUpdatedText}\n
            Version Label:\n${versionLabelText}\n
          `.trim();
            } else {
                // No selectors, just get all text or some default
                const _html = $('body').html()

                if (!_html) {
                    throw new Error('No content found');
                }

                const extractedTextDom = new JSDOM(_html)
                const reader = new Readability(extractedTextDom.window.document)
                const article = reader.parse()

                extractedText = article?.textContent || 'Error: No content found';
            }

        } else if (parserType === 'markdown' || parserType === 'plaintext') {
            // For simplicity, treat them similarly (just read as text)
            extractedText = buffer.toString('utf-8');
        }
    } catch (err: any) {
        console.error(`Error parsing content from ${entry.name}:`, err.message);
        return;
    }

    // 3. Output or store the result
    // Here, we'll just log a snippet of the extracted text
    console.log(`\n--- Extracted content for "${entry.name}" ---`);
    console.log(extractedText.slice(0, 500)); // Show first 500 chars for demonstration
    console.log('--- End of Extracted Content ---\n');
}