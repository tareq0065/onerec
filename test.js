const oneRec = require('./index');

(async () =>
	await oneRec({
		url: 'http://localhost:3000',
		selector: 'div.Composition',
	}))();
