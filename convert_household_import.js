const fs = require('fs');

// Function to read and convert CSV file
function convertHouseholdData() {
  try {
    // Read the source file
    const data = fs.readFileSync('geylang_addresses.csv', 'utf8');
    
    // Read meter serials file
    let meterSerials = [];
    try {
      const meterData = fs.readFileSync('CNNT.meters.csv', 'utf8');
      // Split into lines and extract serial numbers
      const meterLines = meterData.split('\n');
      // Skip header (first line)
      for (let i = 1; i < meterLines.length; i++) {
        const line = meterLines[i].trim();
        if (!line) continue;
        
        // Split by comma and get the serial number (second column)
        const columns = line.split(',');
        if (columns.length >= 2) {
          meterSerials.push(columns[1]);
        }
      }
      console.log(`Loaded ${meterSerials.length} meter serial numbers from CNNT.meters.csv`);
    } catch (err) {
      console.warn('Warning: Could not read CNNT.meters.csv - proceeding without meter serials');
      console.warn(err);
    }
    
    // Split into lines
    const lines = data.split('\n');
    
    // Create new header
    const newHeader = 'code(*);customer_id;first_name;street_number;street_name;city(*);country(*);coordinate;meter_serial';
    
    // Create the new CSV content
    let newContent = [newHeader];
    
    // Counter for assigned meters
    let meterCounter = 0;
    
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
        
        // Get meter serial if available
        let meterSerial = '';
        if (meterCounter < meterSerials.length) {
          meterSerial = meterSerials[meterCounter];
          meterCounter++;
        }
        
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
          meterSerial // meter_serial (from file or empty)
        ].join(';');
        
        newContent.push(newLine);
      }
    }
    
    // Write to new file
    fs.writeFileSync('household_import.csv', newContent.join('\n'), 'utf8');
    
    console.log(`Conversion completed. Created household_import.csv with ${meterCounter} assigned meters.`);
  } catch (err) {
    console.error('Error converting file:', err);
  }
}

// Run the conversion
convertHouseholdData();
