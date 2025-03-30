
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

// Add autotable to jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPdf = (
  title: string,
  data: Array<Record<string, any>>,
  columns: Array<{ header: string; dataKey: string }>,
  fileName: string = "report.pdf"
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(
    `Generated on ${format(new Date(), "PPP")}`,
    14,
    30
  );
  
  // Create table
  doc.autoTable({
    startY: 40,
    head: [columns.map(col => col.header)],
    body: data.map(row => 
      columns.map(col => {
        const value = row[col.dataKey];
        
        // Format percentages and currency values
        if (typeof value === 'number') {
          if (col.dataKey.toLowerCase().includes('percent')) {
            return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
          }
          if (col.dataKey.toLowerCase().includes('price')) {
            return `$${value.toFixed(2)}`;
          }
        }
        
        return value;
      })
    ),
    headStyles: {
      fillColor: [0, 87, 231],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    margin: { top: 40 },
  });
  
  // Add footer
  // Get current page count directly from pages array length
  const pageCount = doc.internal.pages.length - 1;
  
  // For each page, add the footer
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      'Finance Portfolio Dashboard',
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Save the document
  doc.save(fileName);
};
