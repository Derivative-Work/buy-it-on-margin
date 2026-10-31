// B01 (coda bookend): screenshot the public planning-chat share page and locate the coda line in it.
// Usage: node scripts/capture_chat.mjs [url] -> public/media/chat/planning_chat.png + planning_chat.json (target box, page px), copied to config/chat_capture.json
// --no-sandbox: Ubuntu AppArmor blocks Chrome's user-namespace sandbox on this machine.
import puppeteer from 'puppeteer';
import fs from 'fs';
const url = process.argv[2] || 'https://claude.ai/share/6c3c88fb-d879-4878-a42b-e9bf95a87456';
const TARGET = 'its maker just filed to sell stock';
const out = 'public/media/chat';
const browser = await puppeteer.launch({headless: 'shell', args: ['--no-sandbox']});
const page = await browser.newPage();
await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0 Safari/537.36');
await page.setViewport({width: 1280, height: 960, deviceScaleFactor: 2});
await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'light'}]);
await page.goto(url, {waitUntil: 'networkidle2', timeout: 90000});
await new Promise((r) => setTimeout(r, 4000));
// Find the deepest element whose text contains the target, scroll it to the middle, and measure it.
await page.evaluate((t) => {
  const all = [...document.querySelectorAll('p, li, span, div')].filter((e) => e.innerText && e.innerText.includes(t));
  const el = all.sort((a, b) => a.innerText.length - b.innerText.length)[0];
  if (el) { el.setAttribute('data-b01', '1'); el.scrollIntoView({block: 'center', behavior: 'instant'}); }
}, TARGET);
await new Promise((r) => setTimeout(r, 2500));   // let lazy content and smooth scrolling settle before measuring
const box = await page.evaluate((t) => {
  const el = document.querySelector('[data-b01]');
  if (!el) return null;
  // narrow to the text range of the target itself
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n; while ((n = walker.nextNode())) {
    const i = n.textContent.indexOf(t);
    if (i >= 0) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + t.length);
      const b = r.getBoundingClientRect(); return {x: b.x, y: b.y, w: b.width, h: b.height, text: el.innerText.slice(0, 200)}; }
  }
  const b = el.getBoundingClientRect(); return {x: b.x, y: b.y, w: b.width, h: b.height, text: el.innerText.slice(0, 200)};
}, TARGET);
await page.screenshot({path: `${out}/planning_chat.png`});
fs.writeFileSync(`${out}/planning_chat.json`, JSON.stringify({url, target: TARGET, viewport: [1280, 960], scale: 2, box,
  captured: new Date().toISOString()}, null, 1));
fs.writeFileSync('config/chat_capture.json', fs.readFileSync(`${out}/planning_chat.json`));  // committed copy for src/Main.tsx
console.log(JSON.stringify(box));
await browser.close();
