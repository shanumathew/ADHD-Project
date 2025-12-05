import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    const htmlPath = path.join(__dirname, 'ADHD_Project_Presentation.html');
    const pdfPath = path.join(__dirname, 'ADHD_Project_Presentation.pdf');
    
    console.log('Loading HTML file...');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Wait for fonts to load
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Generating PDF...');
    await page.pdf({
        path: pdfPath,
        width: '17in',
        height: '11in',
        landscape: true,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    await browser.close();
    console.log(`PDF saved to: ${pdfPath}`);
}

generatePDF().catch(console.error);
