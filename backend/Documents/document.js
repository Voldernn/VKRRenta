const express = require('express');
const db = require('../db');
const { authenticateUser, authenticateEmployee } = require('../middleware');

const router = express.Router();

// Создать документ (для сотрудников)
router.post('/', authenticateEmployee, async (req, res) => {
  try {
    const { user_id, document_name, link, description } = req.body;
    
    // Проверка существования пользователя
    const userExists = await db.query('SELECT id FROM "User" WHERE id = $1', [user_id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const result = await db.query(
      `INSERT INTO Document (user_id, document_name, link, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, document_name, link, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания документа', error: error.message });
  }
});

// Получить все документы (для сотрудников)
router.get('/all', authenticateEmployee, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.*, u.first_name, u.last_name, u.email
       FROM Document d
       JOIN "User" u ON d.user_id = u.id`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения документов', error: error.message });
  }
});

// Получить документы пользователя (для пользователей и сотрудников)
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    // Проверка прав доступа
    if (req.user.role !== 'employee' && req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const result = await db.query(
      `SELECT d.*, u.first_name, u.last_name, u.email 
       FROM Document d
       JOIN "User" u ON d.user_id = u.id
       WHERE d.user_id = $1`,
      [req.params.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения документов', error: error.message });
  }
});

router.put('/:documentId', authenticateEmployee, async (req, res) => {
  try {
    const { document_name, link, description } = req.body;
    const { documentId } = req.params;

    // Обновление документа
    const result = await db.query(
      `UPDATE Document SET 
         document_name = COALESCE($1, document_name), 
         link = COALESCE($2, link), 
         description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *`,
      [document_name, link, description, documentId]
    );

    res.json({
      message: 'Документ обновлен',
      document: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка обновления документа', 
      error: error.message 
    });
  }
});

// Обновить ссылку документа (для владельца документа и сотрудников)
router.put('/link/:documentId', authenticateUser, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { link } = req.body;

    // Проверка наличия ссылки в теле запроса
    if (!link) {
      return res.status(400).json({ message: 'Ссылка обязательна для обновления' });
    }

    // Проверка валидности ссылки
    if (!isValidUrl(link)) {
      return res.status(400).json({ message: 'Некорректный формат ссылки' });
    }

    // Получение документа для проверки прав доступа
    const documentQuery = await db.query(
      'SELECT user_id FROM Document WHERE id = $1',
      [documentId]
    );

    if (documentQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Документ не найден' });
    }

    const documentUserId = documentQuery.rows[0].user_id;

    // Проверка прав доступа (пользователь может обновлять только свои документы, сотрудник - любые)
    if (req.user.role !== 'employee' && req.user.id !== documentUserId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Обновление ссылки
    const result = await db.query(
      `UPDATE Document SET link = $1 
       WHERE id = $2
       RETURNING id, document_name, link, description`,
      [link, documentId]
    );

    res.json({
      message: 'Ссылка документа успешно обновлена',
      document: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка обновления ссылки документа', 
      error: error.message 
    });
  }
});

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = router;