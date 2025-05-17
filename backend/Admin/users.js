const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authenticateEmployee, isAdmin } = require('../middleware');
const db = require('../db');

// Получение списка всех пользователей
router.get('/', authenticateEmployee, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, age FROM "User" ORDER BY id'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
  }
});

// Получение информации о конкретном пользователе
router.get('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, age FROM "User" WHERE id = $1',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении информации о пользователе' });
  }
});

// Создание нового пользователя (с хешированием пароля)
router.post('/', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { email, first_name, last_name, password, age } = req.body;
    
    if (!email || !first_name || !last_name || !password || !age) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await db.query(
      'INSERT INTO "User" (email, first_name, last_name, password_hash, age) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, age',
      [email, first_name, last_name, hashedPassword, age]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ message: 'Ошибка при создании пользователя' });
  }
});

// Обновление информации о пользователе (без изменения пароля)
router.put('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, age } = req.body;
    
    // Проверяем, что пользователь существует
    const check = await db.query(
      'SELECT id FROM "User" WHERE id = $1',
      [id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    const { rows } = await db.query(
      'UPDATE "User" SET email = $1, first_name = $2, last_name = $3, age = $4 WHERE id = $5 RETURNING id, email, first_name, last_name, age',
      [email, first_name, last_name, age, id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ message: 'Ошибка при обновлении информации о пользователе' });
  }
});

// Изменение пароля пользователя
router.put('/:id/password', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Пароль обязателен' });
    }

    // Проверяем, что пользователь существует
    const check = await db.query(
      'SELECT id FROM "User" WHERE id = $1',
      [id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Хеширование нового пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'UPDATE "User" SET password_hash = $1 WHERE id = $2',
      [hashedPassword, id]
    );
    
    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении пароля' });
  }
});

// Удаление пользователя с предварительным удалением зависимых записей
router.delete('/:id', authenticateEmployee, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Проверяем, что пользователь существует
      const check = await db.query(
        'SELECT id FROM "User" WHERE id = $1',
        [id]
      );
      
      if (check.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      // Начинаем транзакцию
      await db.query('BEGIN');
  
      try {
        // Удаляем все зависимые записи в порядке, обратном созданию
        await db.query('DELETE FROM usermessage WHERE user_id = $1', [id]);
        await db.query('DELETE FROM document WHERE user_id = $1', [id]);
        await db.query('DELETE FROM contract WHERE user_id = $1', [id]);
        await db.query('DELETE FROM estate WHERE user_id = $1', [id]);
        
        // Теперь удаляем самого пользователя
        await db.query('DELETE FROM "User" WHERE id = $1', [id]);
        
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
          message: 'Не удалось удалить пользователя из-за существующих зависимостей',
          detail: error.detail
        });
      }
      res.status(500).json({ message: 'Ошибка при удалении пользователя' });
    }
  });

module.exports = router;