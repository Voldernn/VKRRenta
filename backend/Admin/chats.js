const express = require('express');
const router = express.Router();
const { authenticateEmployee, isAdmin } = require('../middleware');
const db = require('../db');

// Получение списка всех чатов (только для админов)
router.get('/', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, creation_time FROM chat ORDER BY creation_time DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении списка чатов' });
  }
});

// Получение информации о конкретном чате (только для админов)
router.get('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT id, name, creation_time FROM chat WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Чат не найден' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении информации о чате' });
  }
});

// Создание нового чата (только для админов)
router.post('/', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Название чата обязательно' });
    }
    
    const { rows } = await db.query(
      'INSERT INTO chat (name) VALUES ($1) RETURNING id, name, creation_time',
      [name]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании чата' });
  }
});

// Обновление информации о чате (только для админов)
router.put('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Проверяем, что чат существует
    const check = await db.query(
      'SELECT id FROM chat WHERE id = $1',
      [id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Чат не найден' });
    }
    
    const { rows } = await db.query(
      'UPDATE chat SET name = $1 WHERE id = $2 RETURNING id, name, creation_time',
      [name, id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении информации о чате' });
  }
});

// Удаление чата (только для админов)
router.delete('/:id', authenticateEmployee, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Проверяем, что чат существует
      const check = await db.query(
        'SELECT id FROM chat WHERE id = $1',
        [id]
      );
      
      if (check.rows.length === 0) {
        return res.status(404).json({ message: 'Чат не найден' });
      }
  
      // Начинаем транзакцию
      await db.query('BEGIN');
  
      try {
        // Удаляем все сообщения в чате
        await db.query('DELETE FROM usermessage WHERE chat_id = $1', [id]);
        await db.query('DELETE FROM employeemessage WHERE chat_id = $1', [id]);
        
        // Теперь удаляем сам чат
        await db.query('DELETE FROM chat WHERE id = $1', [id]);
        
        // Подтверждаем транзакцию
        await db.query('COMMIT');
        
        res.status(204).send();
      } catch (error) {
        // Откатываем транзакцию в случае ошибки
        await db.query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error(error);
      if (error.code === '23503') {
        return res.status(400).json({ 
          message: 'Не удалось удалить чат из-за существующих зависимостей',
          detail: error.detail
        });
      }
      res.status(500).json({ message: 'Ошибка при удалении чата' });
    }
  });

module.exports = router;