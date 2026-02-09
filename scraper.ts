import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';
import * as path from 'path';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, ExternalHyperlink } from 'docx';

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
      
      const linkElement = card.locator('h2.jobTitle a');
      const href = await linkElement.getAttribute('href');
      const fullLink = href?.startsWith('http') ? href : `https://www.indeed.com${href}`;

      jobs.push({ title, company, link: fullLink });
    }

    // --- UPDATED FOLDER LOGIC ---
    // path.join handles the slashes correctly for your OS
    const outputFolder = path.join('Jobs', 'Indeed', 'SDET');
    
    // recursive: true creates Jobs/ and Jobs/Indeed/ automatically
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
    const fileName = `SDET_Jobs_${timestamp}.docx`;
    const filePath = path.join(outputFolder, fileName);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: `Indeed SDET Jobs - ${timestamp}`, bold: true, size: 32 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Job Title", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Company", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Link", bold: true })] })] }),
                ],
              }),
              ...jobs.map(job => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(job.title)] }),
                  new TableCell({ children: [new Paragraph(job.company)] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new ExternalHyperlink({
                            children: [
                              new TextRun({
                                text: "View Job",
                                color: "0000FF",
                                underline: {},
                              }),
                            ],
                            link: job.link || "",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              })),
            ],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Success! Data saved to: ${filePath}`);

  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await browser.close();
  }
}

scrapeAndSaveToDoc();