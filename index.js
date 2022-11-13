const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const capture = require('./capture');
const fsExtra = require('fs-extra');

module.exports = async (config = {}) => {
	const defaultConfig = Object.assign(
		{
			url: './public/index.html',
			width: 1920,
			height: 1080,
			selector: '#canvas',
			cachePath: '.scene_cache',
			fps: 30,
		},
		config
	);

	console.log('defaultConfig:', defaultConfig);

	const browser = await puppeteer.launch({
		headless: true,
		executablePath:
			'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			// `--window-size=${defaultConfig.width},${defaultConfig.height}`,
		],
	});
	const page = await browser.newPage();

	await page.setDefaultNavigationTimeout(0);
	await page.setViewport({
		width: defaultConfig.width,
		height: defaultConfig.height,
		deviceScaleFactor: 4,
	});
	await page.goto(defaultConfig.url, { waitUntil: 'load', timeout: 0 });

	await page.waitForSelector(defaultConfig.selector);
	const element = await page.$(defaultConfig.selector);

	let theCachePath = path.join(__dirname, defaultConfig.cachePath);
	if (fs.existsSync(theCachePath)) {
		fsExtra.emptyDirSync(theCachePath);
	}
	if (!fs.existsSync(theCachePath)) {
		fs.mkdirSync(theCachePath);
	}

	let totalFrames = defaultConfig.fps * defaultConfig.duration + 1;
	console.log('totalFrames:', totalFrames);
	let shotCounter = 0;
	while (shotCounter < totalFrames) {
		await capture(
			element,
			theCachePath + '/' + shotCounter + '.' + defaultConfig.frameType,
			defaultConfig.frameType,
			defaultConfig.quality
		);
		// console.log('captured:', captured);
		shotCounter++;
	}

	// await browser.close();
};
