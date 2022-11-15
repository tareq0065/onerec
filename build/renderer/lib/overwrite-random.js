const { evaluateOnNewDocument } = require('./utils.js');
const fs = require('fs');
const path = require('path');

// unrandomizer seed constants
// default seed values are only used if all of the seed values end up being 0
const seedIterations = 10;
const randomSeedLimit = 1000000000;

const overwriteRandom = function (page, unrandom, log) {
	if (unrandom === undefined || unrandom === false) {
		return;
	}
	var args, seed;
	if (Array.isArray(unrandom)) {
		args = unrandom;
	} else if (unrandom === 'random-seed') {
		seed = Math.floor(Math.random() * randomSeedLimit) + 1;
		log('Generated seed: ' + seed);
		args = [seed];
	} else if (typeof unrandom === 'string') {
		args = unrandom.split(',').map((n) => parseInt(n));
	} else if (typeof unrandom === 'number') {
		args = [unrandom];
	} else {
		args = [];
	}
	return overwritePageRandom(page, ...args);
};

const overwritePageRandom = async function (
	page,
	seed1 = 0,
	seed2 = 0,
	seed3 = 0,
	seed4 = 0
) {
	const unrandomizeLib = fs.readFileSync(
		path.join(require.resolve('unrandomize/dist/unrandomize.js')),
		{ encoding: 'utf8' }
	);
	await evaluateOnNewDocument(page, unrandomizeLib);
	await evaluateOnNewDocument(
		page,
		function ({ seed1, seed2, seed3, seed4, seedIterations }) {
			(function (exports) {
				var i;
				exports.unrandomize.setState([seed1, seed2, seed3, seed4]);
				for (i = 0; i < seedIterations; i++) {
					Math.random();
				}
			})(this);
		},
		{
			seed1,
			seed2,
			seed3,
			seed4,
			seedIterations,
		}
	);
};

module.exports = {
	overwriteRandom,
};
