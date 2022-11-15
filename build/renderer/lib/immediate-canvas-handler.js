const timeHandler = require('./overwrite-time');
const makeCanvasCapturer = require('./make-canvas-capturer');
var overwriteTime = timeHandler.overwriteTime;

const canvasCapturer = makeCanvasCapturer(async (page) => {
	var dataUrl = await page.evaluate(() => window._timesnap_canvasData);
	var data = dataUrl.slice(dataUrl.indexOf(',') + 1);
	return new Buffer(data, 'base64');
});

module.exports = function (config) {
	var capturer = canvasCapturer(config);
	var canvasCaptureMode = capturer.canvasCaptureMode;
	var canvasSelector = capturer.canvasSelector;
	var quality = capturer.quality;
	var preparePage = async function ({ page }) {
		await page.evaluate(
			function ({ canvasSelector, type, quality }) {
				window._timesnap_saveCanvasData = function () {
					var canvasElement = document.querySelector(canvasSelector);
					window._timesnap_canvasData = canvasElement.toDataURL(type, quality);
				};
			},
			{ canvasSelector, type: canvasCaptureMode, quality }
		);
		if (config.alwaysSaveCanvasData) {
			// the event detail filtering should be aligned with those found in overwrite-time.js
			await page.evaluate(function () {
				window.timeweb.on('postseek', (e) => {
					if (e.detail === 'only seek') {
						window._timesnap_saveCanvasData();
					}
				});
				window.timeweb.on('postanimate', () => {
					window._timesnap_saveCanvasData();
				});
			});
		} else {
			await page.evaluate(function () {
				window.timeweb.on('postanimate', (e) => {
					if (e.detail !== 'no capture') {
						window._timesnap_saveCanvasData();
					}
				});
			});
		}
	};

	return {
		capturer: capturer,
		timeHandler: {
			overwriteTime,
			preparePage,
			goToTime: timeHandler.goToTime,
			goToTimeAndAnimate: timeHandler.goToTimeAndAnimate,
			goToTimeAndAnimateForCapture: timeHandler.goToTimeAndAnimateForCapture,
		},
	};
};
