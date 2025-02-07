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

async function calculateMultipleSTL(req, res) {
  try {
    const files = req.files;
    if (!files || !files.length) {
      throw new Error('Нет загруженных файлов');
    }

    // Параметры из тела запроса
    const priceFilament = req.body.price;  // цена за кг/г
    let margin = req.body.margin || 0;     // маржа
    const plasticType = req.body.type;     // тип пластика

    const densities = readDensities();
    if (!densities) {
      throw new Error('Ошибка чтения базы данных');
    }

    if (!plasticType || !densities[plasticType]) {
      throw new Error(`Не указан тип пластика или данного пластика нет в базе данных. Поддерживаемые: ${Object.keys(densities).join(', ')}`);
    }

    // Итоговые суммы
    let totalVolume = 0;
    let totalWeight = 0;
    let totalPrice = 0;

    // Массив результатов по каждому файлу
    const results = [];

    // Перебираем все загруженные файлы
    for (const file of files) {
      // Проверим расширение
      if (!file.originalname.toLowerCase().endsWith('.stl')) {
        throw new Error(`Файл ${file.originalname} не является STL`);
      }

      const filePath = path.join(__dirname, '../uploads', file.filename);

      // Загружаем и вычисляем
      const geometry = await loadStl(filePath);
      const linearDims = calculateLinearDimensions(geometry);
      const volume = computeVolume(geometry);
      const weight = Number(calcWeight(volume, densities[plasticType]));
      const price = calcPrice(weight, priceFilament, plasticType, margin);

      // Накапливаем общую статистику
      totalVolume += volume;
      totalWeight += weight;
      totalPrice += price;

      // Сохраняем детали по текущему файлу
      results.push({
        filename: file.originalname,
        linearDims,     // если нужно подробно
        volume,
        weight,
        price
      });
    }

    // Формируем итоговый ответ
    const response = {
      filesCount: files.length,
      plasticType,
      totalVolume,
      totalWeight,
      totalPrice,
      details: results
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Ошибка расчета:', error);
    res.status(500).send('Ошибка расчета: ' + error.message);
  } finally {
    // Удаляем все загруженные файлы
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        deleteFile(filePath);
      }
    }
  }
}

module.exports = { calculateMultipleSTL, calculateSTL };