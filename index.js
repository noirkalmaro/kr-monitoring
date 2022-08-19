const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const getDataArray = function (doc) {
		const targetArray = [];
		[].forEach.call(doc.getElementsByClassName('dataRow'), (dr, i) => {
			targetArray[i] = {};
			[].forEach.call(dr.children, (ch) => targetArray[i][ch.id || 'name'] = ch.textContent.replace(/\n/g, '').trim())
		});

		return targetArray;
	}

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// await page.goto('http://localhost:3888/static/1.html', { waitUntil: 'load', timeout: 0 });
	  await page.goto('https://f1karting-m.kartchrono.com/online/?variant=iframe', {waitUntil: 'load', timeout: 0});
	await page.waitForTimeout(3000);

	const datestamp = [(new Date()).toDateString(), '-', (new Date()).getHours(), '-', (new Date()).getMinutes()].join('');
	console.log(111, datestamp);

	const stream = new fs.createWriteStream('stream-' + datestamp + '.json');

	let resolve = null;
	let exitPromise = new Promise((res, rej) => resolve = res);
	let counter = 0;
	const promiseArray = [];
	const cancelInt = setInterval(async () => {
		// promiseArray.push(page.screenshot({path: `example${counter}.png`}));
		console.log('interval in progress', counter);
		const [data, isFinished, d] = await page.evaluate(() => {
			const targetArray = [];
			[].forEach.call(document.getElementsByClassName('dataRow'), (dr, i) => {
				targetArray[i] = {};
				[].forEach.call(dr.children, (ch) => targetArray[i][ch.id || 'name'] = ch.textContent.replace(/\n/g, '').trim().replace(/\s+/g, ' '))
			});

			return [targetArray, runState[FLAG_STATUS] === FLAG_STATUS_FINISH, runState[FLAG_STATUS]];
		});
		counter++;

		console.log(isFinished, d);

		stream.write(JSON.stringify(data))

		// if (counter >= 6) {
		if (isFinished) {
		// if (data[0].session_time.includes(':10:') || runState[FLAG_STATUS] === FLAG_STATUS_FINISH) {
			resolve();
			clearInterval(cancelInt);
			stream.close();
		}
	}, 5 * 1000)
	//   let promise = page.screenshot({path: 'example.png'});
	//   setTimeout(() => {
	// 	promise = page.screenshot({path: 'example.png'});
	//   }, 3000);
	await exitPromise;
	// await Promise.all(promiseArray).then((...args) => args.forEach(a => stream.write(JSON.stringify(a)))).finally(() => stream.close());

	await browser.close();
})();