import fs from "fs"

function saveOutputToJson( flightData) {
        const filePath = 'utils/output.json';
        let existingData = [];
        const fileContent = fs.readFileSync(filePath);
        existingData = JSON.parse(fileContent);

        existingData.push( flightData);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      }
      
module.exports = { saveOutputToJson };