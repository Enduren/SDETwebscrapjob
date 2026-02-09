🕵️‍♂️ Indeed SDET Job Scraper

A robust web scraping tool built with Playwright and TypeScript that finds SDET job listings on Indeed and exports them into neatly formatted, timestamped Microsoft Word (.docx) documents.
✨ Features

    Stealth Mode: Utilizes playwright-extra and the stealth plugin to bypass advanced bot detection.

    Smart Selectors: Uses stable data-testid and beacon selectors to handle Indeed's dynamic layout.

    Word Export: Automatically generates a professional table in a .docx file.

    No Overwrites: Every run creates a unique file named with a precise timestamp (e.g., SDET_Jobs_2026-02-09_19-48-24.docx).

    Headless/Headful Toggle: Easy to switch between background scraping and visual debugging.

🚀 Getting Started

1. Prerequisites

Ensure you have Node.js (v18+) installed.

2. Installation

Clone the repository and install the dependencies:

# Install all required packages

npm install

# Install Playwright browser binaries

npx playwright install chromium

3. Running the Scraper

Since this is a TypeScript project, use tsx to run the script directly:
npx tsx scraper.ts
