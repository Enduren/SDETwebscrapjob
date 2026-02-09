import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun } from 'docx';

chromium.use(stealthPlugin());

async function scrapeAndSaveToDoc() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const query = encodeURIComponent('SDET');
  const url = `https://www.indeed.com/jobs?q=${query}&l=Remote`;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.job_seen_beacon', { timeout: 15000 });

    const jobCards = page.locator('.job_seen_beacon');
    const jobCount = await jobCards.count();
    const jobs = [];

    for (let i = 0; i < jobCount; i++) {
      const card = jobCards.nth(i);
      const title = await card.locator('h2.jobTitle').innerText();
      const company = await card.locator('[data-testid="company-name"]').innerText();
      const location = await card.locator('[data-testid="text-location"]').innerText();
      jobs.push({ title, company, location });
    }

    // --- NEW: GENERATE UNIQUE FILENAME ---
    // This creates a string like "2026-02-09_14-30-05"
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const fileName = `Jobs/Indeed/SDET/SDET_Jobs_${timestamp}.docx`;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: `Indeed SDET Jobs - Scraped at ${timestamp}`, bold: true, size: 32 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Job Title")] }),
                  new TableCell({ children: [new Paragraph("Company")] }),
                  new TableCell({ children: [new Paragraph("Location")] }),
                ],
              }),
              ...jobs.map(job => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(job.title)] }),
                  new TableCell({ children: [new Paragraph(job.company)] }),
                  new TableCell({ children: [new Paragraph(job.location)] }),
                ],
              })),
            ],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(fileName, buffer);
    console.log(`✅ Success! Data saved to: ${fileName}`);

  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await browser.close();
  }
}

scrapeAndSaveToDoc();