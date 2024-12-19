const { loadStl, calculateLinearDimensions, computeVolume, deleteFile } = require('../services/stlService');
const { readDensities, calcWeight } = require('../services/weightService');
const { getPrice, calcPrice } = require('../services/priceService');
const path = require('path');

async function calculateSTL(req, res) {
  try {
    const file = req.file;
    if (!file || !file.originalname.endsWith('.stl')) {
      throw new Error('Проблема с загрузкой файла');
    }

    const priceFilament = req.body.price;
    let margin = req.body.margin || 0;

    const densities = readDensities();
    if (!densities) {
      throw new Error('Ошибка чтения базы данных');
    }

    const plasticType = req.body.type;
    if (!plasticType || !densities[plasticType]) {
      throw new Error(`Не указан тип пластика или данного пластика нет в базе данных. Поддерживаемые типы: ${Object.keys(densities).join(', ')}`);
    }

    const filePath = path.join(__dirname, '../uploads', file.filename);
    const geometry = await loadStl(filePath);
    const result = calculateLinearDimensions(geometry);
    result.volume = computeVolume(geometry);
    result.weight = Number(calcWeight(result.volume, densities[plasticType]));
    result.price = calcPrice(result.weight, priceFilament, plasticType, margin);

    return res.status(200).send(result);
  } catch (error) {
    console.error('Ошибка расчета:', error);
    res.status(500).send('Ошибка расчета: ' + error.message);
  } finally {
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    deleteFile(filePath);
  }
}

module.exports = { calculateSTL };