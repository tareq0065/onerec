const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

const stringArrayFind = function (array, findString) {
	return array.find((iterateString) => iterateString.includes(findString));
};

const getBrowserFrames = function (frame) {
	return [frame].concat(...frame.childFrames().map(getBrowserFrames));
};

const runInAllFrames = async function (page, fn, arg) {
	var browserFrames = getBrowserFrames(page.mainFrame());
	for (let i = 0; i < browserFrames.length; i++) {
		let frame = browserFrames[i];
		if (!frame.isDetached()) {
			await frame.evaluate(fn, arg);
		}
	}
};

const evaluateOnNewDocument = function (page, fn, arg) {
	if (page.evaluateOnNewDocument) {
		if (arg !== undefined) {
			return page.evaluateOnNewDocument(fn, arg);
		} else {
			return page.evaluateOnNewDocument(fn);
		}
	} else if (page.addInitScript) {
		if (arg !== undefined) {
			return page.addInitScript(fn, arg);
		} else {
			return page.addInitScript(fn);
		}
	}
};

const getPageViewportSize = function (page) {
	if (page.viewport) {
		return page.viewport();
	} else if (page.viewportSize) {
		return page.viewportSize();
	}
};

const setPageViewportSize = async function (page, config) {
	if (page.setViewport) {
		return page.setViewport(config);
	} else if (page.setViewportSize) {
		return page.setViewportSize(config);
	}
};

const getSelectorDimensions = async function (page, selector) {
	return page.evaluate(function (selector) {
		var el = document.querySelector(selector);
		var dim = el.getBoundingClientRect();
		if (el) {
			return {
				left: dim.left,
				top: dim.top,
				right: dim.right,
				bottom: dim.bottom,
				scrollX: window.scrollX,
				scrollY: window.scrollY,
				x: dim.x,
				y: dim.y,
				width: dim.width,
				height: dim.height,
			};
		}
	}, selector);
};

const makeFilePathConverter = function (config) {
	var fileNameConverter = config.fileNameConverter;
	if (!fileNameConverter) {
		if (config.outputPattern) {
			fileNameConverter = function (num) {
				return sprintf(config.outputPattern, num);
			};
		} else if (config.frameProcessor && !config.outputDirectory) {
			fileNameConverter = function () {
				return undefined;
			};
		} else {
			fileNameConverter = function (num, maxNum) {
				var extension = config.screenshotType === 'jpeg' ? 'd.jpg' : 'd.png';
				var outputPattern = '%0' + maxNum.toString().length + extension;
				return sprintf(outputPattern, num);
			};
		}
	}
	return function (num, maxNum) {
		var fileName = fileNameConverter(num, maxNum);
		if (fileName) {
			return path.resolve(config.outputPath, fileName);
		} else {
			return undefined;
		}
	};
};

const writeFile = async function (filePath, buffer) {
	makeFileDirectoryIfNeeded(filePath);
	return new Promise(function (resolve, reject) {
		fs.writeFile(filePath, buffer, 'binary', function (err) {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
};

const makeFileDirectoryIfNeeded = function (filepath) {
	var dir = path.parse(filepath).dir,
		ind,
		currDir;
	var directories = dir.split(path.sep);
	for (ind = 1; ind <= directories.length; ind++) {
		currDir = directories.slice(0, ind).join(path.sep);
		if (currDir && !fs.existsSync(currDir)) {
			fs.mkdirSync(currDir);
		}
	}
};

module.exports = {
	getBrowserFrames,
	runInAllFrames,
	evaluateOnNewDocument,
	getPageViewportSize,
	setPageViewportSize,
	getSelectorDimensions,
	writeFile,
	stringArrayFind,
	makeFilePathConverter,
	makeFileDirectoryIfNeeded,
};
