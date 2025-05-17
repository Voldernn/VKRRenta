const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateUser } = require('../middleware');

// Проверка данных
function validateInput(data) {
  const currentYear = new Date().getFullYear();
  const errors = [];

  if (!data.district || typeof data.district !== 'string') {
    errors.push('Некорректное название района');
  }

  if (!Number.isInteger(data.rooms) || data.rooms < 1 || data.rooms > 4) {
    errors.push('Количество комнат должно быть целым числом от 1 до 4');
  }

  if (typeof data.totalArea !== 'number' || data.totalArea < 20 || data.totalArea > 100) {
    errors.push('Площадь должна быть числом от 20 до 100 м²');
  }

  if (!Number.isInteger(data.constructionYear) || 
      data.constructionYear < 1940 || 
      data.constructionYear > currentYear) {
    errors.push(`Год постройки должен быть целым числом от 1940 до ${currentYear}`);
  }

  if (!Number.isInteger(data.buildingFloors) || data.buildingFloors < 1 || data.buildingFloors > 30) {
    errors.push('Этажность должна быть целым числом от 1 до 30');
  }

  if (!Number.isInteger(data.userAge) || data.userAge < 65 || data.userAge > 100) {
    errors.push('Возраст должен быть целым числом от 65 до 100 лет');
  }

  return errors;
}

// Расчет без надобности в авторизации
router.post('/calculate', async (req, res) => {
  const validationErrors = validateInput(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const {
    district,
    rooms,
    totalArea,
    constructionYear,
    buildingFloors,
    userAge
  } = req.body;

  try {
    // Получаем цену за кв.м из БД
    const districtQuery = await db.query(
      'SELECT price_per_meter FROM districts WHERE name = $1',
      [district]
    );

    if (districtQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Район не найден' });
    }

    const pricePerMeter = districtQuery.rows[0].price_per_meter;

    // Расчёт базовой стоимости (цена × площадь)
    let baseCost = pricePerMeter * totalArea;

    // Коэффициент комнат
    if (rooms === 2) baseCost *= 1.05;
    else if (rooms === 3) baseCost *= 1.10;
    else if (rooms === 4) baseCost *= 1.20;

    // Коэффициент возраста дома
    const currentYear = new Date().getFullYear();
    const buildingAge = currentYear - constructionYear;
    
    if (buildingAge <= 25) baseCost *= 1.15;
    else if (buildingAge <= 50) baseCost *= 0.95;
    else if (buildingAge <= 60) baseCost *= 0.90;
    else if (buildingAge <= 70) baseCost *= 1.07;

    // Коэффициент этажности
    if (buildingFloors <= 5) baseCost *= 1.05;
    else if (buildingFloors >= 13) baseCost *= 1.07;

    //Определение платежей по возрасту
    let oneTimePayment, monthlyPayment;
    
    if (userAge >= 65 && userAge < 70) {
      oneTimePayment = baseCost * 0.15;
      monthlyPayment = 20000;
    } else if (userAge >= 70 && userAge < 75) {
      oneTimePayment = baseCost * 0.20;
      monthlyPayment = 23000;
    } else if (userAge >= 75 && userAge < 80) {
      oneTimePayment = baseCost * 0.25;
      monthlyPayment = 25000;
    } else if (userAge >= 80 && userAge < 85) {
      oneTimePayment = baseCost * 0.30;
      monthlyPayment = 30000;
    } else if (userAge >= 85) {
      oneTimePayment = baseCost * 0.35;
      monthlyPayment = 35000;
    }

    res.json({
      oneTimePayment: Math.round(oneTimePayment),
      monthlyPayment: monthlyPayment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/usercalculate', authenticateUser, async (req, res) => {
  try {
    // Получаем ID недвижимости из тела запроса
    const { estateId } = req.body;
    
    if (!estateId) {
      return res.status(400).json({ error: 'Не указан ID недвижимости' });
    }

    // Получаем данные пользователя и конкретной недвижимости
    const userData = await db.query(
      `SELECT 
        u.age,
        e.rooms,
        e.construction_year,
        e.total_area,
        e.building_floors,
        e.district
      FROM "User" u
      JOIN Estate e ON u.id = e.user_id
      WHERE u.id = $1 AND e.id = $2`,
      [req.user.id, estateId]
    );

    if (userData.rows.length === 0) {
      return res.status(404).json({ error: 'Данные пользователя или недвижимости не найдены' });
    }

    const estateData = userData.rows[0];

    const calculationData = {
      district: estateData.district,
      rooms: estateData.rooms,
      totalArea: estateData.total_area,
      constructionYear: estateData.construction_year,
      buildingFloors: estateData.building_floors,
      userAge: estateData.age
    };

    const validationErrors = validateInput(calculationData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Остальной код расчета остается без изменений
    const districtQuery = await db.query(
      'SELECT price_per_meter FROM districts WHERE name = $1',
      [estateData.district]
    );

    if (districtQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Район не найден' });
    }

    const pricePerMeter = districtQuery.rows[0].price_per_meter;
    let baseCost = pricePerMeter * estateData.total_area;

    if (estateData.rooms === 2) baseCost *= 1.05;
    else if (estateData.rooms === 3) baseCost *= 1.10;
    else if (estateData.rooms === 4) baseCost *= 1.20;

    const currentYear = new Date().getFullYear();
    const buildingAge = currentYear - estateData.construction_year;
    
    if (buildingAge <= 25) baseCost *= 1.15;
    else if (buildingAge <= 50) baseCost *= 0.95;
    else if (buildingAge <= 60) baseCost *= 0.90;
    else if (buildingAge <= 70) baseCost *= 1.07;

    if (estateData.building_floors <= 5) baseCost *= 1.05;
    else if (estateData.building_floors >= 13) baseCost *= 1.07;

    let oneTimePayment, monthlyPayment;
    
    if (estateData.age >= 65 && estateData.age < 70) {
      oneTimePayment = baseCost * 0.15;
      monthlyPayment = 20000;
    } else if (estateData.age >= 70 && estateData.age < 75) {
      oneTimePayment = baseCost * 0.20;
      monthlyPayment = 23000;
    } else if (estateData.age >= 75 && estateData.age < 80) {
      oneTimePayment = baseCost * 0.25;
      monthlyPayment = 25000;
    } else if (estateData.age >= 80 && estateData.age < 85) {
      oneTimePayment = baseCost * 0.30;
      monthlyPayment = 30000;
    } else if (estateData.age >= 85) {
      oneTimePayment = baseCost * 0.35;
      monthlyPayment = 35000;
    }

    res.json({
      oneTimePayment: Math.round(oneTimePayment),
      monthlyPayment: monthlyPayment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера при расчете стоимости' });
  }
});

module.exports = router;