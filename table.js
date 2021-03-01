class Table {

  /**
   * Creates a new table.
   * @param {string} database Database spreadsheet ID
   * @param {string} name Table name
   * @param {string[]} headers Column names
   */
  constructor(database, name, headers) {
    this.database = database;
    this.name = name;
    this.headers = headers;
    this.indices = {};
  }

  buildIndex(header) {
    const data = this.readAll();
    const index = {};
    for (let i = 0; i < data.length; i++) { index[data[header]] = i; }
    this.indices[header] = index;
  }

  readAll() {
    const data = getSheetValues(this.database, this.name);
    const list = [];
    for (const row of data) { list.push(this.rowToObj(row)); }
    return list;
  }

  read(header, value) {
    const index = this.indices[header];
    if (index) { return getRowValues(this.database, this.name, index[value]); }

    const data = getSheetValues(this.database, this.name);
    const columnIndex = this.headers.indexOf(header);
    for (const row of data) { if (row[columnIndex] === value) { return this.rowToObj(row); } }

    return null;
  }

  create(obj) {
    const row = objToRow(obj);
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    sheet.appendRow(row);

    const indexNames = Object.keys(this.indices);
    const newRecordIndex = sheet.getLastRow() - 1;
    for (const indexName of indexNames) {
      this.indices[indexName][obj[indexName]] = newRecordIndex;
    }
  }

  update(header, value, obj) {
    const index = this.indices[header];
    if (index) { setRowValues(this.database, this.name, index[value], objToRow(obj)); }

    const data = getSheetValues(this.database, this.name);
    const columnIndex = this.headers.indexOf(header);
    for (let i = 0; i < data.length; i++) {
      if (row[columnIndex] === value) {
        setRowValues(this.database, this.name, i, objToRow(obj));
        return;
      }
    }

    throw new Error('Not found.');
  }

  delete(header, value) {
    const index = this.indices[header];
    if (index) { deleteRow(this.database, this.name, index[value]); }

    const data = getSheetValues(this.database, this.name);
    const columnIndex = this.headers.indexOf(header);
    for (let i = 0; i < data.length; i++) {
      if (row[columnIndex] === value) {
        deleteRow(this.database, this.name, i);

        if (this.indices[header]) { delete this.indices[header][value]; }
        return;
      }
    }

    throw new Error('Not found.');
  }

  rowToObj(row) {
    const obj = {};
    for (let i = 0; i < this.headers.length; i++) { obj[this.headers[i]] = row[i]; }
    return obj;
  }

  objToRow(obj) {
    const row = [];
    for (const header of this.headers) { row.push(obj[header] ?? ''); }
    return row;
  }

}