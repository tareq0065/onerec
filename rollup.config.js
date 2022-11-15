// Rollup plugins
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const copy = require('rollup-plugin-copy');
const { terser } = require('rollup-plugin-terser');
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
		terser(),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		babel({
			exclude: 'node_modules/**',
			presets: [
				['@babel/preset-env', { modules: false }],
				'@babel/preset-react',
			],
		}),
		uglify(),
		copy({
			targets: [{ src: 'renderer/*', dest: 'build/renderer' }],
		}),
	],
};
