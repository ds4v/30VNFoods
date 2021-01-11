var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

const img = document.querySelector('#screenshot');
const canvas = document.createElement('canvas');

const gotDevices = deviceInfos => {
	window.deviceInfos = deviceInfos;
	console.log('Available input and output devices:', deviceInfos);

	for (const deviceInfo of deviceInfos) {
		const option = document.createElement('option');
		option.value = deviceInfo.deviceId;

		if (deviceInfo.kind === 'audioinput') {
			var length = `Microphone ${audioSelect.length + 1}`;
			option.text = deviceInfo.label || length;
			audioSelect.appendChild(option);
		} else if (deviceInfo.kind === 'videoinput') {
			var length = `Camera ${videoSelect.length + 1}`;
			option.text = deviceInfo.label || length;
			videoSelect.appendChild(option);
		}
	}
};

const gotStream = stream => {
	window.stream = stream;
	audioSelect.selectedIndex = [...audioSelect.options].findIndex(
		option => option.text === stream.getAudioTracks()[0].label
	);
	videoSelect.selectedIndex = [...videoSelect.options].findIndex(
		option => option.text === stream.getVideoTracks()[0].label
	);
	videoElement.srcObject = stream;
	videoElement.playsInline = true;
};

const getStream = () => {
	if (window.stream) window.stream.getTracks().forEach(track => track.stop());
	const audioSource = audioSelect.value;
	const videoSource = videoSelect.value;

	const constraints = {
		audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
		video: { deviceId: videoSource ? { exact: videoSource } : undefined },
	};

	return navigator.mediaDevices
		.getUserMedia(constraints)
		.then(gotStream)
		.catch(console.log);
};

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

videoElement.onclick = () => {
	canvas.width = videoElement.videoWidth;
	canvas.height = videoElement.videoHeight;
	canvas.getContext('2d').drawImage(videoElement, 0, 0);
	img.src = canvas.toDataURL('image/jpg');
};

getStream()
	.then(() => navigator.mediaDevices.enumerateDevices())
	.then(gotDevices);
