const express = require('express');
const db = require('../db');
const { authenticateUser, authenticateEmployee } = require('../middleware');

const router = express.Router();

// Пользователь создает запись (без cost и description)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { 
      rooms, 
      construction_year, 
      total_area, 
      building_floors,
      district
    } = req.body;
    const districtCheck = await db.query(
      'SELECT 1 FROM districts WHERE name = $1',
      [district]
    );
    if (districtCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Указанный район не существует' });
    }

    const result = await db.query(
      `INSERT INTO Estate (
        user_id, rooms, construction_year, 
        total_area, building_floors, district
      ) VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [req.user.id, rooms, construction_year, total_area, building_floors, district]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания объекта', error: error.message });
  }
});

// Пользователь может обновлять свои объекты (кроме cost и description)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      rooms, 
      construction_year, 
      total_area, 
      building_floors,
      district
    } = req.body;

    const estateCheck = await db.query(
      'SELECT 1 FROM Estate WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (estateCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Недостаточно прав для редактирования' });
    }

    if (district) {
      const districtCheck = await db.query(
        'SELECT 1 FROM districts WHERE name = $1',
        [district]
      );
      if (districtCheck.rows.length === 0) {
        return res.status(400).json({ message: 'Указанный район не существует' });
      }
    }

    const result = await db.query(
      `UPDATE Estate SET
        rooms = COALESCE($1, rooms),
        construction_year = COALESCE($2, construction_year),
        total_area = COALESCE($3, total_area),
        building_floors = COALESCE($4, building_floors),
        district = COALESCE($5, district)
      WHERE id = $6
      RETURNING id, rooms, construction_year, total_area, building_floors, district`,
      [rooms, construction_year, total_area, building_floors, district, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Объект не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления объекта', error: error.message });
  }
});

router.put('/:id/admin', authenticateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      rooms, 
      construction_year, 
      total_area, 
      building_floors,
      description,
      cost,
      district
    } = req.body;

    if (district) {
      const districtCheck = await db.query(
        'SELECT 1 FROM districts WHERE name = $1',
        [district]
      );
      if (districtCheck.rows.length === 0) {
        return res.status(400).json({ message: 'Указанный район не существует' });
      }
    }

    const result = await db.query(
      `UPDATE Estate SET
        rooms = COALESCE($1, rooms),
        construction_year = COALESCE($2, construction_year),
        total_area = COALESCE($3, total_area),
        building_floors = COALESCE($4, building_floors),
        description = COALESCE($5, description),
        cost = COALESCE($6, cost),
        district = COALESCE($7, district)
      WHERE id = $8
      RETURNING *`,
      [rooms, construction_year, total_area, building_floors, description, cost, district, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Объект не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления объекта', error: error.message });
  }
});

router.get('/my', authenticateUser, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        id, rooms, construction_year, 
        total_area, building_floors, district
       FROM Estate 
       WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

router.get('/all', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        e.id, e.rooms, e.construction_year, 
        e.total_area, e.building_floors, 
        e.description, e.cost, e.district,
        u.first_name, u.last_name, u.email
       FROM Estate e 
       JOIN "User" u ON e.user_id = u.id`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

router.get('/:id', authenticateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT 
        e.id, e.rooms, e.construction_year, 
        e.total_area, e.building_floors, 
        e.description, e.cost, e.district,
        u.first_name, u.last_name, u.email
       FROM Estate e 
       JOIN "User" u ON e.user_id = u.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Объект не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

module.exports = router;