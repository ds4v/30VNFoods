function onOpen() {
	const ui = SpreadsheetApp.getUi();
	const menu = ui.createMenu('TOOL GÁN NHÃN');
	menu.addItem('Mở Form', 'loadLabelingForm');
	menu.addToUi();
}

function loadLabelingForm() {
	const service = HtmlService.createTemplateFromFile('index');
	const html = service.evaluate().setTitle('TOOL GÁN NHÃN');
	const ui = SpreadsheetApp.getUi();
	ui.showSidebar(html);
}

function getSheetNames() {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheetNames = spreadSheet.getSheets().map(sheet => sheet.getName());
	return sheetNames;
}

function getActiveAddress() {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const activeSheet = spreadSheet.getActiveSheet();
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
	if (activeRow - 1 === 0 || activeCol > 3) activeRow = 2;
	return [
		`Image ${activeRow - 1}.jpg`,
		activeSheet.getName(),
		...activeSheet.getRange(activeRow, 2, 1, 2).getValues()[0],
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
	const destRange = destSheet.getRange(destLastRow, 2, 1, 2);
	const srcRange = activeSheet.getRange(activeRow, 2, 1, 2);

	srcRange.moveTo(destRange);
	activeSheet.deleteRow(activeRow);
}

function deleteImage() {
	const [activeSheet, activeRow, activeCol] = getActiveAddress();
	activeSheet.deleteRow(activeRow);
}

function sortSheets() {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheets = spreadSheet.getSheets();
	const sheetNameArray = [];

	for (var i = 0; i < sheets.length; i++)
		sheetNameArray.push(sheets[i].getName());
	sheetNameArray.sort();

	for (var j = 0; j < sheets.length; j++) {
		spreadSheet.setActiveSheet(spreadSheet.getSheetByName(sheetNameArray[j]));
		spreadSheet.moveActiveSheet(j + 1);
	}
}
