const fs = require('fs');

// Function to read and convert CSV file
function convertHouseholdData() {
  try {
    // Read the source file
    const data = fs.readFileSync('geylang_addresses.csv', 'utf8');
    
    // Split into lines
    const lines = data.split('\n');
    
    // Create new header
    const newHeader = 'code(*);customer_id;first_name;street_number;street_name;city(*);country(*);coordinate;meter_serial';
    
    // Create the new CSV content
    let newContent = [newHeader];
    
    // Skip header (first line) and process the rest
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Parse the current line
      const columns = line.split(';');
      
      // Make sure we have enough columns
      if (columns.length >= 6) {
        const no = columns[0];
        const streetNumber = columns[1];
        const streetName = columns[2];
        const householdOwner = columns[3];
        const householdCode = columns[4];
        const coordinate = columns[5];
        
        // Create new line with transformed data
        const newLine = [
          householdCode, // code(*)
          householdCode, // customer_id (same as household code)
          householdOwner, // first_name
          streetNumber, // street_number
          streetName, // street_name
          'Singapore', // city(*)
          'Singapore', // country(*)
          coordinate, // coordinate
          '' // meter_serial (empty)
        ].join(';');
        
        newContent.push(newLine);
      }
    }
    
    // Write to new file
    fs.writeFileSync('household_import.csv', newContent.join('\n'), 'utf8');
    
    console.log('Conversion completed. Created household_import.csv');
  } catch (err) {
    console.error('Error converting file:', err);
  }
}

// Run the conversion
convertHouseholdData();
