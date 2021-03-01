function generateUuid() {
  if (crypto) {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getSheetValues(spreadsheetId, sheetName) {
  const values = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName)
  .getDataRange().getValues();
  values.shift();
  return values;
}

function getRowValues(spreadsheetId, sheetName, rowIndex) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  return sheet.getRange(rowIndex + 1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function setRowValues(spreadsheetId, sheetName, rowIndex, values) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  return sheet.getRange(rowIndex + 1, 1, 1, sheet.getLastColumn()).setValues(values);
}

function deleteRow(spreadsheetId, sheetName, rowIndex) {
  SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName).deleteRow(rowIndex + 1);
}