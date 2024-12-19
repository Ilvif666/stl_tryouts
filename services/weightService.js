const fs = require('fs');
const path = require('path');

const densitiesFilePath = path.join(__dirname, 'json', 'density.json');

function readDensities() {
    try {
        const data = fs.readFileSync(densitiesFilePath, 'utf8');
        const densities = JSON.parse(data);
        return densities;
    } catch (err) {
        console.error('Error reading densities file:', err);
        return null;
    }
}

function calcWeight(volume, density) {
    return (volume * density / 1000).toFixed(2);
}

module.exports = {
    readDensities,
    calcWeight
};