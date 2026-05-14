import { QAScraper, DevOpsScraper, SDETScraper, TestopsScraper, TruckDriverScraper, SupplyChainScraper, FraudAnalystScraper, AIDataTrainingScraper, DataAnalystScraper, DataEntryScraper, HealthInformationManagementDirectorScraper, DirectorOfClinicalOperationsScraper, OperationsSupervisorScraper, SiteReliabilityEngineerScraper, TestInfrastructureEngineerScraper } from './Page/JobScrapers.js';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

// Apply stealth once globally
chromium.use(stealthPlugin());

async function runAllScrapers() {
  const qa = new QAScraper();
  const devops = new DevOpsScraper();
  const sdet = new SDETScraper();
  const testops= new TestopsScraper();
  const truckDriver= new TruckDriverScraper();
  const supplyChain= new SupplyChainScraper();
  const fraudAnalyst = new FraudAnalystScraper();
  const aiData = new AIDataTrainingScraper();
  const dataAnalyst= new DataAnalystScraper();
  const dataEntry= new DataEntryScraper();
  const himDir= new HealthInformationManagementDirectorScraper();
  const dirClinic = new DirectorOfClinicalOperationsScraper();
  const opsSuper = new OperationsSupervisorScraper();
  const siteReliabilityEngineer = new SiteReliabilityEngineerScraper();
  const testInfrastrutureEngineer = new TestInfrastructureEngineerScraper()

  // Running them one after another
  await qa.scrape();
  await devops.scrape();
  await sdet.scrape();
  // await testops.scrape();
  // await truckDriver.scrape();
  // await supplyChain.scrape();
  // await fraudAnalyst.scrape();
  // await aiData.scrape();
  // await dataAnalyst.scrape();
  // await dataEntry.scrape();
  // await himDir.scrape();
  // await dirClinic.scrape();
  // await opsSuper.scrape();
  // await siteReliabilityEngineer.scrape()
  // await testInfrastrutureEngineer.scrape()
  console.log('🏁 All job searches complete.');
}

runAllScrapers();