function removeDuplicatesInSheet(currentSheet) {
	if (currentSheet.getName() === 'Thống kê') return;
	currentSheet.activate();

	const currentData = currentSheet.getDataRange().getValues();
	const newData = [];

	for (let i in currentData) {
		let url = currentData[i][1];
		let duplicate = false;

		for (let j in newData) if (url == newData[j][0]) duplicate = true;
		if (!duplicate) newData.push(currentData[i].slice(1, 4));
	}

	currentSheet
		.getRange(1, 2, currentData.length, currentData[0].length)
		.clearContent();

	currentSheet
		.getRange(1, 2, newData.length, newData[0].length)
		.setValues(newData);

	return newData.length - 2;
}

function downloadUrlsInSheet(currentSheet) {
	if (currentSheet.getName() === 'Thống kê') return;
	currentSheet.activate();

	const lastRow = getLastRowByCol(currentSheet, 2);
	const fileName = `${currentSheet.getName()}.txt`;

	const folder = DriveApp.getFoldersByName('Vietnamese Foods').next();
	const file = folder.getFilesByName(fileName);

	const dataRange = currentSheet.getRange(2, 2, lastRow - 1, 1);
	const fileContent = dataRange.getValues().join('\n');

	if (file.hasNext()) file.next().setContent(fileContent);
	else folder.createFile(fileName, fileContent);
	return dataRange.getNumRows();
}

function setImageCellsSizeInSheet(currentSheet, newSize) {
	if (currentSheet.getName() === 'Thống kê') return;
	currentSheet.activate();

	const height = newSize[0] ? Number(newSize[0]) : 200;
	const width = newSize[1] ? Number(newSize[1]) : 350;

	currentSheet.setRowHeights(2, currentSheet.getLastRow() - 1, height);
	currentSheet.setColumnWidth(1, width);
}
