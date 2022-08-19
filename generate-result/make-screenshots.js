const puppeteer = require('puppeteer');

(async () => {

	const browser = await puppeteer.launch({
		args: [
		  '--window-size=1920,1080',
		],
	  });
	const page = await browser.newPage();
	await page.setViewport({
		width: 1563,
		height: 850,
	  });

	await page.goto('http://localhost:3000/qualification', {waitUntil: 'load', timeout: 0});
	await page.waitForTimeout(10000);
	await page.screenshot({path: 'qualification.png'});

	await page.goto('http://localhost:3000/raceC', {waitUntil: 'load', timeout: 0});
	await page.waitForTimeout(5000);
	await page.screenshot({path: 'raceC.png'});

	await page.goto('http://localhost:3000/raceB', {waitUntil: 'load', timeout: 0});
	await page.waitForTimeout(5000);
	await page.screenshot({path: 'raceB.png'});

	await page.goto('http://localhost:3000/raceA', {waitUntil: 'load', timeout: 0});
	await page.waitForTimeout(5000);
	await page.screenshot({path: 'raceA.png'});

	await browser.close();
})();