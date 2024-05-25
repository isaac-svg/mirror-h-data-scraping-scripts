const fs = require('fs');
const csv = require('csv-parser');

// Define the path to your CSV file
const inputFile = 'output.csv';
// Attacker,Country,URL,IP,Date

// Function to write data to a CSV file
function writeToCSV(filename, data) {
    // console.log(data, "data")
    fs.writeFileSync(filename, '');
    fs.appendFileSync(filename, 'Attacker,Country,URL,IP,Date\n'); // Add header row if needed
    data.forEach((row) => {
        fs.appendFileSync(filename, `${row.Attacker},${row.Country},${row.URL},${row.IP},${row.Date}\n`); // Adjust this line according to your CSV structure
    });
}

let count = 0
// Read the CSV file
let chunk = [];
fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (data) => {
        // Initialize an array to hold the current chunk of data
        count+=1;
// console.log(data, "===data==")
        // Read data in chunks of 20,000 rows
        // console.log(count)
        if (count % 100000 === 0) {
            const fileIndex = Math.floor(count / 100000);
            const outputFile = `split_${fileIndex}.csv`;
            // chunk.push(data);
            console.log(" I am hit with count: ", count)
            // writeToCSV(outputFile, chunk);
            // count = 0;
            chunk = []
        } else {
            chunk.push(data);

        }
    })
    .on('end', () => {
        const fileIndex = Math.floor(count / 100000);
        const outputFile = `split_${21}.csv`;
        // chunk.push(data);
        writeToCSV(outputFile, chunk);
        console.log('CSV file split into chunks.');
    });
// https://wormhole.app/3rd58#sZIJlWyVW6KRayu-Aq4b4A