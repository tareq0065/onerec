// Rollup plugins
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const { uglify } = require('rollup-plugin-uglify');

module.exports = {
	input: 'index.js',
	output: {
		file: './build/onerec.min.js',
		format: 'es',
	},
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		commonjs(),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		babel({
			exclude: 'node_modules/**',
			babelrc: false,
		}),
		replace({
			exclude: 'node_modules/**',
		}),
		uglify(),
	],
};
