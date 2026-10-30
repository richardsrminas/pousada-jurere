<!doctype html>
<meta charset="utf-8"><title>Jurerê Skills</title>
<h1>Auditoria visual Jurerê</h1>
<pre id="result">Testes iniciados</pre>
<script type="module">
import { chromium } from 'playwright';
const browser = await chromium.launch({headless: true});
const page = await browser.newPage({viewport: {width:390,height:844},deviceScaleFactor:1});
const failures = [];
page.on('pageerror', error=>failures.push(String(error)));
await page.goto('http://127.0.0.1:8087/', {waitUntil:'networkidle'});
await page.waitForTimeout(2800);
const report={title:await page.title(),hero:await page.locator('#heroTitle').innerText(),assetChecks:await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0}))),viewports:[],interactions:{}};
for(const width of [390,1024]){await page.setViewportSize({width,height:844});await page.waitForTimeout(150);report.viewports.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth})));}
await page.setViewportSize({width:390,height:844});await page.locator('#menuToggle').click();report.interactions.menuOpens=await page.locator('#menuToggle').getAttribute('aria-expanded');report.interactions.menuLinkVisible=await page.locator('#navLinks a').first().isVisible();await page.locator('#menuToggle').click();await page.locator('.dock button').click();report.interactions.quoteOpens=await page.locator('#quoteModal').evaluate(e=>e.classList.contains('open'));report.interactions.initialEstimate=await page.locator('#totalPrice').innerText();await page.locator('#roomSelect').selectOption({label:'Chalé VIP — R$ 1.100/noite'});await page.locator('#nights').fill('3');report.interactions.vipThreeNights=await page.locator('#totalPrice').innerText();await page.keyboard.press('Escape');report.interactions.escapeClosesQuote=await page.locator('#quoteModal').evaluate(e=>!e.classList.contains('open'));await page.locator('[data-open="directions"]').click();report.interactions.directionsOpens=await page.locator('#directionsModal').evaluate(e=>e.classList.contains('open'));report.interactions.directionsChoices=await page.locator('#directionsModal a').allTextContents();await page.keyboard.press('Escape');report.consoleErrors=failures;
await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'remote-worktree/jurere-preview.png',fullPage:true});
await browser.close();console.log(JSON.stringify(report,null,2));
'@; Get-ChildItem -Force remote-worktree | Select-Object Mode,Name