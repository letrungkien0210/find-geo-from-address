const fs = require('fs');
const path = require('path');

// Input and output file paths
const inputFile = 'household_import copy2.csv';
const outputFile = 'household_import_processed.csv';

// Function to process the CSV file
async function processCSV() {
  try {
    // Read the input file
    const data = fs.readFileSync(inputFile, 'utf8');
    
    // Split into lines
    const lines = data.split('\n');
    
    // Get the header line
    const headerLine = lines[0];
    
    // Process each line, filtering for rows with a dot in the first_name
    const processedLines = [headerLine];
    
    lines.slice(1).forEach((line) => {
      // Skip empty lines
      if (!line.trim()) return;
      
      // Split the line by the delimiter
      const columns = line.split(';');
      
      // Skip if the line doesn't have the expected number of columns
      if (columns.length < 3) return;
      
      // 1. Check if first_name column contains a dot "."
      if (columns[2] && columns[2].includes('.')) {
        // 2. Remove dots from the first_name column
        columns[2] = columns[2].replace(/\./g, '');
        
        // 3. Reduce the length of "Code(*)" column to less than 16 chars
        if (columns[0] && columns[0].length >= 16) {
          columns[0] = columns[0].substring(0, 15);
        }
        
        // 4. Reduce the length of "customer_id" column to less than 16 chars
        if (columns[1] && columns[1].length >= 16) {
          columns[1] = columns[1].substring(0, 15);
        }
        
        // 5. Remove special characters like "(" or ")" from the first_name column
        if (columns[2]) {
          columns[2] = columns[2].replace(/[()[\]{}]/g, '');
        }
        
        // Add the processed line
        processedLines.push(columns.join(';'));
      }
    });
    
    // Write the processed data to the output file
    fs.writeFileSync(outputFile, processedLines.join('\n'), 'utf8');
    
    console.log(`Processing complete! Output saved to ${outputFile}`);
    console.log(`Total lines processed: ${processedLines.length}`);
    console.log(`Total lines with dots in first_name: ${processedLines.length - 1}`);
    
  } catch (error) {
    console.error('Error processing the CSV file:', error);
  }
}

// Run the function
processCSV(); 