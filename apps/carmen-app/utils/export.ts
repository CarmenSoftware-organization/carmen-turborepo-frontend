import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

/**
 * Export data to Excel file
 */
export const exportToExcel = (data: ExportData) => {
  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${data.filename}.xlsx`);
};

/**
 * Export data to PDF file
 */
export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(data.filename, 14, 15);

  // Add table
  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Save PDF
  doc.save(`${data.filename}.pdf`);
};

/**
 * Export data to Word (HTML format that can be opened in Word)
 */
export const exportToWord = (data: ExportData) => {
  // Create HTML table
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.filename}</title>
      <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>${data.filename}</h1>
      <table>
        <thead>
          <tr>
            ${data.headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data.rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create blob and trigger download
  const blob = new Blob([html], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
