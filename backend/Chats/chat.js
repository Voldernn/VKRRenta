const express = require('express');
const db = require('../db');
const { authenticateUser, authenticateEmployee } = require('../middleware');

const router = express.Router();

router.get('/all', authenticateEmployee, async (req, res) => {
  try {
    const chats = await db.query(
      `SELECT c.* FROM Chat c
       ORDER BY c.creation_time DESC`
    );
    res.json(chats.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения всех чатов', error: error.message });
  }
});

// Создать чат (доступно и пользователям и сотрудникам)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, userId } = req.body;
    const creatorId = req.user.id;
    const isEmployee = req.user.role && req.user.role !== 'user';

    const chatResult = await db.query(
      `INSERT INTO Chat (name) 
       VALUES ($1) 
       RETURNING *`,
      [name || `Чат ${new Date().toLocaleString()}`]
    );
    const chatId = chatResult.rows[0].id;

    if (isEmployee) {
      await db.query(
        `INSERT INTO EmployeeMessage (employee_id, chat_id, content)
         VALUES ($1, $2, $3)`,
        [creatorId, chatId, 'Чат создан']
      );

      if (userId) {
        await db.query(
          `INSERT INTO UserMessage (user_id, chat_id, content)
           VALUES ($1, $2, $3)`,
          [userId, chatId, 'Вас добавили в чат']
        );
      }
    } else {
      await db.query(
        `INSERT INTO UserMessage (user_id, chat_id, content)
         VALUES ($1, $2, $3)`,
        [creatorId, chatId, 'Чат создан']
      );
    }

    res.status(201).json(chatResult.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания чата', error: error.message });
  }
});

// Добавить пользователя в чат (только для сотрудников)
router.post('/:chatId/add-user', authenticateEmployee, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const userExists = await db.query('SELECT id FROM "User" WHERE id = $1', [userId]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const alreadyAdded = await db.query(
      'SELECT 1 FROM UserMessage WHERE chat_id = $1 AND user_id = $2 LIMIT 1',
      [chatId, userId]
    );
    if (alreadyAdded.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь уже в чате' });
    }

    await db.query(
      `INSERT INTO UserMessage (user_id, chat_id, content)
       VALUES ($1, $2, $3)`,
      [userId, chatId, 'Вас добавили в чат']
    );

    res.json({ message: 'Пользователь добавлен в чат' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка добавления пользователя', error: error.message });
  }
});

// Подключиться к чату (для сотрудников)
router.post('/:chatId/join', authenticateEmployee, async (req, res) => {
  try {
    const { chatId } = req.params;
    const employeeId = req.employee.id; // Changed from req.user.id to req.employee.id

    const alreadyJoined = await db.query(
      'SELECT 1 FROM EmployeeMessage WHERE chat_id = $1 AND employee_id = $2 LIMIT 1',
      [chatId, employeeId]
    );
    if (alreadyJoined.rows.length > 0) {
      return res.status(400).json({ message: 'Вы уже в этом чате' });
    }

    await db.query(
      `INSERT INTO EmployeeMessage (employee_id, chat_id, content)
       VALUES ($1, $2, $3)`,
      [employeeId, chatId, 'Подключился к чату']
    );

    res.json({ message: 'Вы подключились к чату' });
  } catch (error) {
    console.error('Error joining chat:', error);
    res.status(500).json({ message: 'Ошибка подключения к чату', error: error.message });
  }
});

router.get('/:chatId/participants', authenticateUser, async (req, res) => {
  try {
    const { chatId } = req.params;
    const hasAccess = await checkChatAccess(req.user, chatId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const participants = await db.query(
      `SELECT 
         u.id, u.first_name, u.last_name, u.email, 'user' as type
       FROM UserMessage um
       JOIN "User" u ON um.user_id = u.id
       WHERE um.chat_id = $1
       GROUP BY u.id
       
       UNION
       
       SELECT 
         e.id, e.first_name, e.last_name, e.email, 'employee' as type
       FROM EmployeeMessage em
       JOIN Employee e ON em.employee_id = e.id
       WHERE em.chat_id = $1
       GROUP BY e.id`,
      [chatId]
    );

    res.json(participants.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения участников', error: error.message });
  }
});

router.get('/my', authenticateUser, async (req, res) => {
  try {
    const isEmployee = req.user.role && req.user.role !== 'user';
    
    let chats;
    if (isEmployee) {
      chats = await db.query(
        `SELECT DISTINCT c.* FROM Chat c
         JOIN EmployeeMessage em ON em.chat_id = c.id
         WHERE em.employee_id = $1
         UNION
         SELECT DISTINCT c.* FROM Chat c
         JOIN UserMessage um ON um.chat_id = c.id
         JOIN Contract co ON co.user_id = um.user_id
         WHERE co.status = 'active'`,
        [req.user.id]
      );
    } else {
      chats = await db.query(
        `SELECT DISTINCT c.* FROM Chat c
         JOIN UserMessage um ON um.chat_id = c.id
         WHERE um.user_id = $1`,
        [req.user.id]
      );
    }

    res.json(chats.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения чатов', error: error.message });
  }
});

router.put('/:chatId', authenticateEmployee, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Название чата обязательно' });
    }

    const result = await db.query(
      `UPDATE Chat SET name = $1 WHERE id = $2 RETURNING *`,
      [name, chatId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Чат не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления чата', error: error.message });
  }
});

async function checkEmployeeChatAccess(chatId) {
  const chatExists = await db.query('SELECT 1 FROM Chat WHERE id = $1', [chatId]);
  return chatExists.rows.length > 0;
}

router.get('/:chatId/messages', authenticateUser, async (req, res) => {
  try {
    const isEmployee = req.user.role && req.user.role !== 'user';
    const chatId = req.params.chatId;

    // Для сотрудников разрешаем просмотр без участия в чате
    if (isEmployee) {
      const hasAccess = await checkEmployeeChatAccess(chatId);
      if (!hasAccess) {
        return res.status(404).json({ message: 'Чат не найден' });
      }
    } 
    // Для обычных пользователей оставляем старую проверку
    else {
      const hasAccess = await checkChatAccess(req.user, chatId);
      if (!hasAccess) {
        return res.status(403).json({ message: 'Доступ к чату запрещен' });
      }
    }

    // Получаем сообщения
    const messages = await db.query(
      `SELECT 
         um.id, um.user_id, NULL as employee_id, 
         u.first_name, u.last_name, um.content, um.time,
         'user' as type
       FROM UserMessage um
       JOIN "User" u ON um.user_id = u.id
       WHERE um.chat_id = $1
       
       UNION ALL
       
       SELECT 
         em.id, NULL as user_id, em.employee_id,
         e.first_name, e.last_name, em.content, em.time,
         'employee' as type
       FROM EmployeeMessage em
       JOIN Employee e ON em.employee_id = e.id
       WHERE em.chat_id = $1
       
       ORDER BY time ASC`,
      [chatId]
    );

    res.json(messages.rows);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения сообщений', error: error.message });
  }
});

router.post('/:chatId/messages', authenticateUser, async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.chatId;
    const isEmployee = req.user.role && req.user.role !== 'user';

    const hasAccess = await checkChatAccess(req.user, chatId);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Доступ к чату запрещен' });
    }

    let result;
    if (isEmployee) {
      result = await db.query(
        `INSERT INTO EmployeeMessage (employee_id, chat_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [req.user.id, chatId, content]
      );
    } else {
      result = await db.query(
        `INSERT INTO UserMessage (user_id, chat_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [req.user.id, chatId, content]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка отправки сообщения', error: error.message });
  }
});

async function checkChatAccess(user, chatId) {
  const userId = user.id;
  const isEmployee = user.role && user.role !== 'user';

  if (isEmployee) {
    const employeeAccess = await db.query(
      `SELECT 1 FROM EmployeeMessage 
       WHERE chat_id = $1 AND employee_id = $2 LIMIT 1`,
      [chatId, userId]
    );
    return employeeAccess.rows.length > 0;
  } else {
    const userAccess = await db.query(
      `SELECT 1 FROM UserMessage 
       WHERE chat_id = $1 AND user_id = $2 LIMIT 1`,
      [chatId, userId]
    );
    return userAccess.rows.length > 0;
  }
}

// router.get('/users', authenticateEmployee, async (req, res) => {
//   try {
//     const result = await db.query('SELECT id, first_name, last_name, email FROM "User"');
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ message: 'Ошибка получения пользователей', error: error.message });
//   }
// });



module.exports = router;