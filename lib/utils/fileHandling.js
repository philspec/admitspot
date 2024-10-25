import csv from 'csv-parse';
import XLSX from 'xlsx';

export async function parseCSV(fileBuffer) {
  return new Promise((resolve, reject) => {
    csv.parse(fileBuffer, { columns: true, trim: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });
}

export function parseExcel(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

export function generateCSV(data) {
  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
  return header + rows;
}