const express = require('express');
const db = require('../db');
const { authenticateUser, authenticateEmployee } = require('../middleware');

const router = express.Router();

// Создать контракт (для сотрудников)
router.post('/', authenticateEmployee, async (req, res) => {
  try {
    const { 
      user_id, 
      status, 
      description, 
      monthly_payment, 
      one_time_payment,
      total_payment
    } = req.body;
    
    const userExists = await db.query('SELECT id FROM "User" WHERE id = $1', [user_id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const result = await db.query(
      `INSERT INTO Contract 
       (user_id, status, description, monthly_payment, one_time_payment, total_payment)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, status, description, monthly_payment, one_time_payment, total_payment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания контракта', error: error.message });
  }
});

// Обновить контракт (для сотрудников)
router.put('/:id', authenticateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      status, 
      description, 
      monthly_payment, 
      one_time_payment,
      total_payment
    } = req.body;


    const contractExists = await db.query('SELECT id FROM Contract WHERE id = $1', [id]);
    if (contractExists.rows.length === 0) {
      return res.status(404).json({ message: 'Контракт не найден' });
    }

    const result = await db.query(
      `UPDATE Contract SET
        status = $1,
        description = $2,
        monthly_payment = $3,
        one_time_payment = $4,
        total_payment = $5
       WHERE id = $6
       RETURNING *`,
      [status, description, monthly_payment, one_time_payment, total_payment, id]
    );

    res.json({
      message: 'Контракт успешно обновлен',
      contract: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления контракта', error: error.message });
  }
});

// Получить все контракты (для сотрудников)
router.get('/all', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.first_name, u.last_name 
       FROM Contract c
       JOIN "User" u ON c.user_id = u.id`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения контрактов', error: error.message });
  }
});

router.get('/my', authenticateUser, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM Contract 
       WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения данных', error: error.message });
  }
});

// Получить контракты пользователя 
router.get('/user/:userId', authenticateUser, authenticateEmployee, async (req, res) => {
  try {

    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const result = await db.query(
      `SELECT * FROM Contract 
       WHERE user_id = $1`,
      [req.params.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения контрактов', error: error.message });
  }
});

// Получить конкретный контракт (для сотрудников)
router.get('/:id', authenticateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT c.*, u.first_name, u.last_name 
       FROM Contract c
       JOIN "User" u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Контракт не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения контракта', error: error.message });
  }
});

const cron = require('node-cron');

const updateMonthlyPayments = async () => {
  try {
    const contracts = await db.query(
      `SELECT id, monthly_payment, total_payment 
       FROM Contract 
       WHERE status = 'active' AND monthly_payment > 0`
    );

    for (const contract of contracts.rows) {
      const newTotal = parseFloat(contract.total_payment) + parseFloat(contract.monthly_payment);
      await db.query(
        `UPDATE Contract 
         SET total_payment = $1 
         WHERE id = $2`,
        [newTotal, contract.id]
      );
    }

    console.log('Ежемесячные платежи успешно обновлены');
  } catch (error) {
    console.error('Ошибка при обновлении платежей:', error.message);
  }
};

cron.schedule('0 0 1 * *', updateMonthlyPayments, {
  timezone: 'Europe/Moscow'
});

module.exports = router;