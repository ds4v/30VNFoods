let simulateRightClick = element => {
	const eventInitDict = {
		bubbles: true,
		cancelable: false,
		view: window,
		button: 2,
		buttons: 2,
		clientX: element.getBoundingClientRect().x,
		clientY: element.getBoundingClientRect().y,
	};
	element.dispatchEvent(new MouseEvent('mousedown', eventInitDict));
	element.dispatchEvent(new MouseEvent('mouseup', eventInitDict));
	element.dispatchEvent(new MouseEvent('contextmenu', eventInitDict));
};

let getURLParam = (queryString, key) => {
	let vars = queryString.replace(/^\?/, '').split('&');
	for (let i = 0; i < vars.length; ++i) {
		let pair = vars[i].split('=');
		if (pair[0] == key) return pair[1];
	}
	return false;
};

let createDownload = contents => {
	const hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:attachment/text,' + encodeURI(contents);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'urls.txt';
	hiddenElement.click();
};

let grabUrls = () => {
	let urls = [];
	return new Promise((resolve, reject) => {
		let listUrls = document.querySelectorAll('.isv-r a:first-of-type');
		let index = 0;

		listUrls.forEach(element => {
			simulateRightClick(element.querySelector('img'));
			var interval = setInterval(() => {
				if (element.href.trim() !== '') {
					clearInterval(interval);
					let googleUrl = element.href.replace(/.*(\?)/, '$1');

					fullImageUrl = decodeURIComponent(
						getURLParam(googleUrl, 'imgurl')
					);
					if (fullImageUrl !== 'false') urls.push(fullImageUrl);
					if (++index == listUrls.length - 1) resolve(urls);
				}
			}, 10);
		});
	});
};

grabUrls().then(urls => createDownload(urls.join('\n')));
