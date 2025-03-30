/**
 * Utility function to export data as a CSV file
 * @param data Array of objects to export
 * @param columns Array of column definitions
 * @param fileName Name of the exported file
 */
export const exportToCsv = (
  data: Array<Record<string, any>>,
  columns: Array<{ header: string; dataKey: string }>,
  fileName: string = "export.csv"
): void => {
  // Create header row
  const headerRow = columns.map(col => `"${col.header}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      const value = row[col.dataKey];
      
      // Format values appropriately for CSV
      if (value === null || value === undefined) {
        return '';
      }
      
      if (typeof value === 'string') {
        // Escape quotes and wrap with quotes
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      if (typeof value === 'number') {
        // Format percentages and currency values
        if (col.dataKey.toLowerCase().includes('percent')) {
          return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
        }
        if (col.dataKey.toLowerCase().includes('price')) {
          return `$${value.toFixed(2)}`;
        }
        return value.toString();
      }
      
      return `"${String(value)}"`;
    }).join(',');
  });
  
  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join('\n');
  
  // Create a Blob with the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.display = 'none';
  
  // Append the link to the body, click it, and then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  URL.revokeObjectURL(url);
}; 