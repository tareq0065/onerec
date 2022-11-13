module.exports = async (element, path, fileType, quality) => {
	return new Promise(async (resolve) => {
		let configs = {
			path: path,
			captureBeyondViewport: true,
		};

		if (fileType === 'jpeg' || fileType === 'jpg') {
			configs.quality = quality;
		}

		let buffer = element.screenshot(configs);
		console.log(path, buffer);
		resolve(buffer);
	});
};
