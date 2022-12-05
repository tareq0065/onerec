const Recorder = require('./index');
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
let rr = new Recorder({
	launcher: (launchOptions) => puppeteer.launch({...launchOptions, args: ['--no-sandbox', '--disable-gpu']}),
	url: 'http://35.86.55.154/panel/render?id=OTjNFvEMwgFBjvDuhTqqJ&t=1399|Uz3aCbxnaw5K1TtbfQcdKwRdNWGEo4tk1Wgu65zA',
	viewport: {
		width: 1920, // sets the viewport (window size) to 800x600
		height: 1080,
	},
	width: 1920, // sets the viewport (window size) to 800x600
	height: 1080,
	selector: '#Composition',
	threads: 4,
	left: 0,
	top: 0, // further crops the left by 20px, and the top by 40px
	right: 0,
	bottom: 0, // and the right by 6px, and the bottom by 30px
	fps: 25, // saves 30 frames for each virtual second
	duration: 60, // for 20 virtual seconds
	screenshotType: 'jpeg', // jpeg/png
	output: '4.mp4', // to video.mp4 of the current working directory
	audio: path.resolve(__dirname, 'baabe3f44de32eeadf7d55ee6f034382.mp3'),
	executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
});

rr.record().then(function () {
	console.log('Done 2!');
});
