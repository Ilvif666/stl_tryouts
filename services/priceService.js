const fs = require('fs');
const path = require('path');


function getPrice(filament) {
    try {
        const filamentPricesFilePath = path.join(__dirname, 'json', 'filament_price.json');
        if (filamentPricesFilePath) {
        const data = fs.readFileSync(filamentPricesFilePath, 'utf8');
        const prices = JSON.parse(data);
        return prices[filament]; 
    }
    } catch (err) {
        console.error('Error reading prices file:', err);
        return null;
    }
}

function calcPrice(weight, price, filament, margin) {
    const priceToUse = price || getPrice(filament);
    if (priceToUse === null) {
        throw new Error('Нет цены за кг филамента: ' + filament);
    }
    return weight * priceToUse / 1000 * (1 + margin / 100);
}

module.exports = {
    getPrice,
    calcPrice
};