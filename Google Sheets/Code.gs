function onOpen() {
	const ui = SpreadsheetApp.getUi();
	const menu = ui.createMenu('TOOLS GÁN NHÃN');
	menu.addItem('Mở form gán nhãn', 'loadLabelingForm');
	menu.addItem('Sắp xếp sheets theo tên', 'sortSheets');
	menu.addToUi();
}

function loadLabelingForm() {
	const service = HtmlService.createTemplateFromFile('index');
	const html = service.evaluate().setTitle('TOOL GÁN NHÃN');
	const ui = SpreadsheetApp.getUi();
	ui.showSidebar(html);
}

function sortSheets() {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheets = spreadSheet.getSheets();
	const sheetNameArray = [];

	for (let i = 0; i < sheets.length; i++)
		sheetNameArray.push(sheets[i].getName());
	sheetNameArray.sort();

	for (let j = 0; j < sheets.length; j++) {
		spreadSheet.setActiveSheet(
			spreadSheet.getSheetByName(sheetNameArray[j])
		);
		spreadSheet.moveActiveSheet(j + 1);
	}
}

function removeDuplicates() {
	const activeSheet = SpreadsheetApp.getActiveSheet();
	const currentData = activeSheet.getDataRange().getValues();
	const newData = [];

	for (let i in currentData) {
		let row = currentData[i].slice(1, 3);
		let duplicate = false;

		for (let j in newData)
			if (row.join() == newData[j].join()) duplicate = true;
		if (!duplicate) newData.push(row);
	}

	activeSheet
		.getRange(1, 2, currentData.length, newData[0].length)
		.clearContent();

	activeSheet
		.getRange(1, 2, newData.length, newData[0].length)
		.setValues(newData);
}

function getSheetNames() {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheetNames = spreadSheet.getSheets().map(sheet => sheet.getName());
	return sheetNames;
}

function getActiveAddress() {
	const activeSheet = SpreadsheetApp.getActiveSheet();
	const activeCell = activeSheet.getActiveCell();
	return [activeSheet, activeCell.getRow(), activeCell.getColumn()];
}

function getLastRowByCol(sheet, col) {
	const lastRow = sheet.getLastRow();
	const range = sheet.getRange(lastRow, col);
	if (range.getValue() !== '') return lastRow;
	return range.getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
}

function getCurrentInfo() {
	const [activeSheet, activeRow, activeCol] = getActiveAddress();
	if (activeRow - 1 === 0 || activeCol > 4) activeRow = 2;
	return [
		`Image ${activeRow - 1}.jpg`,
		activeSheet.getName(),
		...activeSheet.getRange(activeRow, 2, 1, 3).getValues()[0],
	];
}

function moveImage(dest) {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const destSheet = spreadSheet.getSheetByName(dest);

	const [activeSheet, activeRow, activeCol] = getActiveAddress();
	if (
		activeSheet.getSheetName() === destSheet.getSheetName() ||
		activeRow - 1 === 0 ||
		activeCol > 3
	)
		return;

	const destLastRow = getLastRowByCol(destSheet, 2) + 1;
	const destRange = destSheet.getRange(destLastRow, 2, 1, 3);
	const srcRange = activeSheet.getRange(activeRow, 2, 1, 3);

	srcRange.copyTo(destRange);
	activeSheet.deleteRow(activeRow);
}

function deleteImage() {
	const [activeSheet, activeRow, activeCol] = getActiveAddress();
	activeSheet.deleteRow(activeRow);
}
