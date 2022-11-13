const { makeFilePathConverter, writeFile } = require('./utils.js');
const path = require('path');

const defaultCanvasCaptureMode = 'png';

module.exports = function makeCanvasCapturer(canvasToBuffer) {
	return function (config) {
		var page = config.page;
		var log = config.log;
		var frameProcessor = config.frameProcessor;
		var filePathConverter = makeFilePathConverter(config);
		var canvasCaptureMode = config.canvasCaptureMode;
		var canvasSelector = config.selector || 'canvas';
		var pendingWritePromises = [];
		var waitForWriting = false;
		var framesToCapture = config.framesToCapture;
		var quality = config.screenshotQuality;
		var filePath = filePathConverter(1, framesToCapture);
		if (typeof canvasCaptureMode !== 'string' || !canvasCaptureMode) {
			canvasCaptureMode = config.screenshotType;
			if (!canvasCaptureMode && filePath) {
				canvasCaptureMode = path.extname(filePath).substring(1);
			}
			if (!canvasCaptureMode) {
				canvasCaptureMode = defaultCanvasCaptureMode;
			}
		}
		if (!canvasCaptureMode.startsWith('image/')) {
			canvasCaptureMode = 'image/' + canvasCaptureMode;
		}
		if (canvasCaptureMode === 'image/jpg') {
			canvasCaptureMode = 'image/jpeg';
		}
		return {
			canvasCaptureMode,
			canvasSelector,
			quality,
			capture: async function (sameConfig, frameCount) {
				filePath = filePathConverter(frameCount, framesToCapture);
				log(
					'Capturing Frame ' +
						frameCount +
						(filePath ? ' to ' + filePath : '') +
						'...'
				);
				var buffer = await canvasToBuffer(
					page,
					canvasSelector,
					canvasCaptureMode,
					quality
				);
				if (filePath) {
					let writePromise = writeFile(filePath, buffer);
					if (waitForWriting) {
						await writePromise;
					} else {
						pendingWritePromises.push(writePromise);
					}
				}
				if (frameProcessor) {
					await frameProcessor(buffer, frameCount, framesToCapture);
				}
				return buffer;
			},
			afterCapture: async function () {
				return Promise.all(pendingWritePromises);
			},
		};
	};
};
