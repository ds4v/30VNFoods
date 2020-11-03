function onOpen() {
	const ui = SpreadsheetApp.getUi();
	const menu = ui.createMenu('TOOLS BỔ TRỢ');

	menu.addItem('Mở tool gán nhãn', 'loadLabelingForm');
	menu.addSeparator();

	menu.addItem('Sắp xếp sheets theo tên', 'sortSheets');
	menu.addItem('Xóa urls trùng trong sheets', 'removeDuplicates');
	menu.addItem('Download urls trong sheets', 'downloadUrls');
	menu.addSeparator();

	menu.addItem('Đặt kích thước cho ô chứa ảnh', 'setImageCellsSize');
	menu.addItem('Move ảnh đang chọn qua nhãn Khác', 'moveImage');
	menu.addToUi();
}

function loadLabelingForm() {
	const service = HtmlService.createTemplateFromFile('LabelingForm');
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
	const response = myMsgBox('Xóa urls trùng trong sheet');
	if (response === 'yes') {
		runOnAllSheets(removeDuplicatesInSheet);
		Browser.msgBox(
			'Xóa urls trùng trong sheet',
			'Đã xóa urls trùng của tất cả sheets',
			Browser.Buttons.OK
		);
	} else if (response === 'no') {
		const result = runOnActiveSheet(removeDuplicatesInSheet);
		Browser.msgBox(
			'Xóa urls trùng trong sheet',
			`Số ảnh còn lại hiện tại: ${result} ảnh`,
			Browser.Buttons.OK
		);
	}
}

function downloadUrls() {
	const response = myMsgBox('Download urls');
	if (response === 'yes') {
		runOnAllSheets(downloadUrlsInSheet);
		Browser.msgBox(
			'Download thành công',
			'Đã lưu urls của tất cả sheets vào Google Drive',
			Browser.Buttons.OK
		);
	} else if (response === 'no') {
		const result = runOnActiveSheet(downloadUrlsInSheet);
		Browser.msgBox(
			'Download thành công',
			`Đã lưu ${result} urls vào Google Drive`,
			Browser.Buttons.OK
		);
	}
}

function setImageCellsSize() {
	const response = myMsgBox('Đặt kích thước ô chứa ảnh');
	const newSize = SpreadsheetApp.getUi()
		.prompt(
			'Chọn kích thước cho ô chứa ảnh',
			'Nhập kích thước mới theo định dạng (height,width) - Mặc định: 200,350',
			SpreadsheetApp.getUi().ButtonSet.OK
		)
		.getResponseText()
		.split(',');

	if (response === 'yes') runOnAllSheets(setImageCellsSizeInSheet, newSize);
	else if (response === 'no') runOnActiveSheet(activeSheet, newSize);
}

function moveImage(dest = 'Khác') {
	const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
	const destSheet = spreadSheet.getSheetByName(dest);

	const [activeSheet, activeRow, activeCol] = getActiveAddress();
	if (
		activeSheet.getName() === destSheet.getName() ||
		activeSheet.getName() === 'Thống kê' ||
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
