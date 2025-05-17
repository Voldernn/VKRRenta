const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateEmployee, isAdmin } = require('../middleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// router.post('/register', authenticateEmployee, isAdmin, async (req, res) => {
//   try {
//     const { email, first_name, last_name, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await db.query(
//       `INSERT INTO Employee (email, first_name, last_name, password_hash, role) 
//        VALUES ($1, $2, $3, $4, $5) 
//        RETURNING id, email, first_name, last_name, role`,
//       [email, first_name, last_name, hashedPassword, role]
//     );

//     res.status(201).json({
//       message: 'Сотрудник зарегистрирован',
//       employee: result.rows[0]
//     });
//   } catch (error) {
//     if (error.code === '23505') {
//       return res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
//     }
//     res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(
      'SELECT * FROM Employee WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден' });
    }

    const employee = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, employee.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign(
      { id: employee.id, email: employee.email, role: employee.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Вход выполнен успешно',
      token,
      employee: {
        id: employee.id,
        email: employee.email,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка входа', error: error.message });
  }
});

router.get('/', authenticateEmployee, isAdmin, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role FROM Employee'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

router.get('/me', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, role FROM Employee WHERE id = $1',
      [req.employee.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Сотрудник не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

module.exports = router;