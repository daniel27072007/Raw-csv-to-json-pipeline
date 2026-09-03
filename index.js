import fs from 'fs'
import csv from 'csv-parser'

const uniqueId = new Set()
const outputPath = './data_output/clean_data.json'
let firstRow = true

const WriteStream = fs.createWriteStream(outputPath, 'utf-8');
WriteStream.write('[\n')

fs.createReadStream('./data_input/raw_export.csv', 'utf-8')
    .pipe(csv({
        mapHeaders: ({ header }) => header.trim().toLowerCase(),
        mapValues: ({ value }) => value.trim().toLowerCase()
    }))
    .on('data', (row)=>{
        //check to see if event_id in row has something
        if (!row.event_id || row.event_id.trim() === '') {
            return;
        }
        //checks for duplicates
        const eventId = row.event_id
        if(uniqueId.has(eventId)){
            return;
        }
        uniqueId.add(row.event_id)
        //fix revenue_amount values
        const cleanRevenue = row.revenue_amount.replace(/[^0-9.]/g, '')
        row.revenue_amount = parseFloat(cleanRevenue) || 0
        //sendnig row to JSON
        if(!firstRow){
            WriteStream.write(',\n')
        }
        else{
            firstRow = false
        }
        const jsonString = JSON.stringify(row, null, 2)
        WriteStream.write(jsonString)
    })
    .on('end', ()=>{
        WriteStream.write('\n]')
        WriteStream.end()
        console.log('Pipeline concluded with success.');
        console.log(`JSON created and saved in: ${outputPath}`);
        console.log(`Total of register processed: ${uniqueId.size}`);
    })