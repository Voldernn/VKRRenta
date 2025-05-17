const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authenticateEmployee, isAdmin } = require('../middleware');
const db = require('../db');

// Получение списка всех сотрудников (кроме администраторов)
router.get('/', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, role FROM employee WHERE role != $1 ORDER BY id',
      ['admin']
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении списка сотрудников' });
  }
});

// Получение информации о конкретном сотруднике
router.get('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, role FROM employee WHERE id = $1 AND role != $2',
      [id, 'admin']
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден или у вас нет прав' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении информации о сотруднике' });
  }
});

// Создание нового сотрудника (с хешированием пароля)
router.post('/', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { email, first_name, last_name, password, role } = req.body;
    
    if (!email || !first_name || !last_name || !password || !role) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }
    
    if (role === 'admin') {
      return res.status(403).json({ message: 'Нельзя создать сотрудника с правами администратора' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await db.query(
      'INSERT INTO employee (email, first_name, last_name, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
      [email, first_name, last_name, hashedPassword, role]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ message: 'Ошибка при создании сотрудника' });
  }
});

// Обновление информации о сотруднике (без изменения пароля)
router.put('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, role } = req.body;
    
    // Проверяем, что сотрудник существует и не является администратором
    const check = await db.query(
      'SELECT id FROM employee WHERE id = $1 AND role != $2',
      [id, 'admin']
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден или у вас нет прав' });
    }
    
    if (role === 'admin') {
      return res.status(403).json({ message: 'Нельзя изменить роль на администратора' });
    }
    
    const { rows } = await db.query(
      'UPDATE employee SET email = $1, first_name = $2, last_name = $3, role = $4 WHERE id = $5 RETURNING id, email, first_name, last_name, role',
      [email, first_name, last_name, role, id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }
    res.status(500).json({ message: 'Ошибка при обновлении информации о сотруднике' });
  }
});

// Дополнительный эндпоинт для изменения пароля сотрудника
router.put('/:id/password', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Пароль обязателен' });
    }

    // Проверяем, что сотрудник существует и не является администратором
    const check = await db.query(
      'SELECT id FROM employee WHERE id = $1 AND role != $2',
      [id, 'admin']
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден или у вас нет прав' });
    }

    // Хеширование нового пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'UPDATE employee SET password_hash = $1 WHERE id = $2',
      [hashedPassword, id]
    );
    
    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении пароля' });
  }
});

// Удаление сотрудника
router.delete('/:id', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверяем, что сотрудник существует и не является администратором
    const check = await db.query(
      'SELECT id FROM employee WHERE id = $1 AND role != $2',
      [id, 'admin']
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден или у вас нет прав' });
    }
    
    await db.query('DELETE FROM employee WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении сотрудника' });
  }
});

module.exports = router;