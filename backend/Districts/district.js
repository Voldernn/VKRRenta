const express = require('express');
const db = require('../db');
const { authenticateEmployee, isAdmin } = require('../middleware');

const router = express.Router();

router.get('/', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query('SELECT name, price_per_meter FROM districts');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

router.put('/:name', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { name } = req.params;
    const { price_per_meter } = req.body;

    if (!price_per_meter || isNaN(price_per_meter)) {
      return res.status(400).json({ message: 'Некорректное значение цены' });
    }

    const result = await db.query(
      'UPDATE districts SET price_per_meter = $1 WHERE name = $2 RETURNING name, price_per_meter',
      [price_per_meter, name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Район не найден' });
    }

    res.json({
      message: 'Цена за квадратный метр успешно обновлена',
      district: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления данных', error: error.message });
  }
});

module.exports = router;