const recorder = require('./index');
const puppeteer = require('puppeteer');
const path = require('path');

// possible params
// url: 'http://localhost:3000/render',
// 	viewport: {
// 		width: 1920, // sets the viewport (window size) to 800x600
// 		height: 1080,
// },
// width: 1920, // sets the viewport (window size) to 800x600
// height: 1080,
// selector: '#Composition', // crops each frame to the bounding box of '#container'
// left: 1,
// top: 1, // further crops the left by 20px, and the top by 40px
// right: 1,
// bottom: 1, // and the right by 6px, and the bottom by 30px
// fps: 25, // saves 30 frames for each virtual second
// duration: 6, // for 20 virtual seconds
// screenshotType: 'jpeg', // jpeg/png
// output: 'a78s68as6d87.mp4', // to video.mp4 of the current working directory
// audio: path.resolve(__dirname, 'audio.mp3'),

recorder({
	launcher: (launchOptions) => puppeteer.launch(launchOptions),
	url: 'http://localhost:3000/render',
	viewport: {
		width: 1920, // sets the viewport (window size) to 800x600
		height: 1080,
	},
	width: 1920, // sets the viewport (window size) to 800x600
	height: 1080,
	selector: '#Composition', // crops each frame to the bounding box of '#container'
	left: 1,
	top: 1, // further crops the left by 20px, and the top by 40px
	right: 1,
	bottom: 1, // and the right by 6px, and the bottom by 30px
	fps: 25, // saves 30 frames for each virtual second
	duration: 6, // for 20 virtual seconds
	screenshotType: 'jpeg', // jpeg/png
	output: 'a78s68as6d87.mp4', // to video.mp4 of the current working directory
	audio: path.resolve(__dirname, 'audio.mp3'),
}).then(function () {
	console.log('Done!');
});
