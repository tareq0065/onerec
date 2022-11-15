const makeCanvasCapturer = require('./make-canvas-capturer');

const canvasToBuffer = async function (page, canvasSelector, type, quality) {
	var dataUrl = await page.evaluate(
		({ canvasSelector, type, quality }) =>
			document.querySelector(canvasSelector).toDataURL(type, quality),
		{ canvasSelector, type, quality }
	);
	var data = dataUrl.slice(dataUrl.indexOf(',') + 1);
	return new Buffer(data, 'base64');
};

module.exports = makeCanvasCapturer(canvasToBuffer);
