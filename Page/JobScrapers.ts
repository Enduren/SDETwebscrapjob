import { chromium } from 'playwright-extra';
// Import 'Page' as a type from the core playwright library
import type { Page } from 'playwright'; 
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';
import * as path from 'path';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, ExternalHyperlink } from 'docx';

// Base Class to handle common logic
class BaseIndeedScraper {
  protected jobTitle: string;
  protected folderPath: string;

  constructor(jobTitle: string, folderPath: string) {
    this.jobTitle = jobTitle;
    this.folderPath = folderPath;
  }

  async scrape() {
    console.log(`🚀 Starting scrape for: ${this.jobTitle}`);
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const query = encodeURIComponent(this.jobTitle);
    const url = `https://www.indeed.com/jobs?q=${query}&l=Remote`;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.job_seen_beacon', { timeout: 10000 });

      const jobCards = page.locator('.job_seen_beacon');
      const jobs = [];

      for (let i = 0; i < await jobCards.count(); i++) {
        const card = jobCards.nth(i);
        const title = await card.locator('h2.jobTitle').innerText();
        const company = await card.locator('[data-testid="company-name"]').innerText();
        const href = await card.locator('h2.jobTitle a').getAttribute('href');
        const link = href?.startsWith('http') ? href : `https://www.indeed.com${href}`;
        jobs.push({ title, company, link });
      }

      await this.saveToDoc(jobs);
    } catch (error) {
      console.error(`❌ Failed scraping ${this.jobTitle}:`, error);
    } finally {
      await browser.close();
    }
  }

  private async saveToDoc(jobs: any[]) {
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filePath = path.join(this.folderPath, `${this.jobTitle.replace(/\s+/g, '_')}_${timestamp}.docx`);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: `${this.jobTitle} Results`, bold: true, size: 32 })] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Title")] }),
                  new TableCell({ children: [new Paragraph("Company")] }),
                  new TableCell({ children: [new Paragraph("Link")] }),
                ]
              }),
              ...jobs.map(job => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(job.title)] }),
                  new TableCell({ children: [new Paragraph(job.company)] }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new ExternalHyperlink({
                        children: [new TextRun({ text: "View", color: "0000FF", underline: {} })],
                        link: job.link
                      })]
                    })]
                  })
                ]
              }))
            ]
          })
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Saved: ${filePath}`);
  }
}

// 2. Specific Job Classes
export class QAScraper extends BaseIndeedScraper {
  constructor() { super('QA Software Engineer', path.join('Jobs', 'Indeed', 'QASE')); }
}

export class DevOpsScraper extends BaseIndeedScraper {
  constructor() { super('DevOps', path.join('Jobs', 'Indeed', 'DevOps')); }
}

export class SDETScraper extends BaseIndeedScraper {
  constructor() { super('SDET', path.join('Jobs', 'Indeed', 'SDET')); }
}

export class TestopsScraper extends BaseIndeedScraper {
  constructor() { super('Testops', path.join('Jobs', 'Indeed', 'Testops')); }
}

export class TruckDriverScraper extends BaseIndeedScraper {
  constructor() { super('Truck CDL Driver', path.join('Jobs', 'Indeed', 'Truck Driver')); }
}

export class SupplyChainScraper extends BaseIndeedScraper {
  constructor() { super('Supply Chain Coordinator', path.join('Jobs', 'Indeed', 'Supply Chain Coordinator')); }
}

export class FraudAnalystScraper extends BaseIndeedScraper {
  constructor() { super('Fraud Analyst', path.join('Jobs', 'Indeed', 'Fraud Analyst')); }
}

export class AIDataTrainingScraper extends BaseIndeedScraper {
  constructor() { super('AI Data Training', path.join('Jobs', 'Indeed', 'AI Data Training')); }
}

export class DataAnalystScraper extends BaseIndeedScraper {
  constructor() { super('Data Analyst', path.join('Jobs', 'Indeed', 'Data Analyst')); }
}

export class DataEntryScraper extends BaseIndeedScraper {
  constructor() { super('Data Entry', path.join('Jobs', 'Indeed', 'Data Entry')); }
}

export class HealthInformationManagementDirectorScraper extends BaseIndeedScraper {
  constructor() { super('Health Information Management Director', path.join('Jobs', 'Indeed', 'Health Information Management Director')); }
}

export class DirectorOfClinicalOperationsScraper extends BaseIndeedScraper {
  constructor() { super('Director of Clinical Operations', path.join('Jobs', 'Indeed', 'Director of Clinical Operations')); }
}

export class OperationsSupervisorScraper extends BaseIndeedScraper {
  constructor() { super('Operations Supervisor', path.join('Jobs', 'Indeed', 'Operations Supervisor')); }
}


export class SiteReliabilityEngineerScraper extends BaseIndeedScraper {
  constructor() { super('Site Reliability Engineer', path.join('Jobs', 'Indeed', 'Site Reliability Engineer')); }
}

//Test Infrastructure Engineer
export class TestInfrastructureEngineerScraper extends BaseIndeedScraper {
  constructor() { super('Test Infrastructure Engineer', path.join('Jobs', 'Indeed', 'Test Infrastructure Engineer')); }
}


