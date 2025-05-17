const express = require('express');
const db = require('../db');
const { authenticateEmployee, isAdmin } = require('../middleware');

const router = express.Router();

// Получить всех пользователей (для админов)
router.get('/', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, age FROM "User"'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения пользователей', error: error.message });
  }
});

// Получить пользователя по ID (для админов)
router.get('/:id', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, age FROM "User" WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения пользователя', error: error.message });
  }
});

// Обновить пользователя (для админов)
router.put('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { first_name, last_name, age } = req.body;
    const result = await db.query(
      `UPDATE "User" 
       SET first_name = $1, last_name = $2, age = $3 
       WHERE id = $4 
       RETURNING id, email, first_name, last_name, age`,
      [first_name, last_name, age, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления пользователя', error: error.message });
  }
});

router.delete('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM "User" WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления пользователя', error: error.message });
  }
});

module.exports = router;