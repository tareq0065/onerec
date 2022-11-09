const puppeteer = require('puppeteer');
const { Scene } = require('scenejs');

module.exports = async (config = {}) => {
	const defaultConfig = Object.assign(
		{
			url: 'http://localhost:6006/?path=/story/canvas--canvas-story',
			width: 1920,
			height: 1080,
			selector: '#canvas',
		},
		config
	);

	console.log('defaultConfig:', defaultConfig);

	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);

	await page.goto(defaultConfig.url, { waitUntil: 'load', timeout: 0 });
	await page.waitForSelector(defaultConfig.selector);
	const element = await page.$(defaultConfig.selector);
	await element.screenshot({
		path: `.scene_cache/post_image_test.jpg`,
	});

	await browser.close();
};
