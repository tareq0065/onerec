const fs = require('fs');
const path = require('path');
const { evaluateOnNewDocument, runInAllFrames } = require('./utils.js');

const timewebLib = fs.readFileSync(
	path.join(require.resolve('timeweb/dist/timeweb.js')),
	{ encoding: 'utf8' }
);
const overwriteTime = async function (page) {
	return evaluateOnNewDocument(page, timewebLib);
};

const goToTime = async function (page, time) {
	// Goes to a certain time. Can't go backwards
	return runInAllFrames(
		page,
		function (ms) {
			window.timeweb.goTo(ms, { skipAnimate: true, detail: 'only seek' });
		},
		time
	);
};

const goToTimeAndAnimate = async function (page, time) {
	// Goes to a certain time. Can't go backwards
	return runInAllFrames(
		page,
		function (ms) {
			window.timeweb.goTo(ms, { detail: 'no capture' });
		},
		time
	);
};

const goToTimeAndAnimateForCapture = async function (page, time) {
	// Goes to a certain time. Can't go backwards
	return runInAllFrames(
		page,
		function (ms) {
			window.timeweb.goTo(ms);
		},
		time
	);
};

module.exports = {
	overwriteTime,
	goToTime,
	goToTimeAndAnimate,
	goToTimeAndAnimateForCapture,
};
