const db = require('../db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Новое соединение WebSocket:', socket.id);

    socket.on('join-chat', async (chatId, userId) => {
      try {
        socket.join(`chat_${chatId}`);
        console.log(`Пользователь ${userId} присоединился к чату ${chatId}`);
        
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
        
        socket.emit('initial-messages', messages.rows);
      } catch (error) {
        console.error('Ошибка при подключении к чату:', error);
      }
    });

    socket.on('send-message', async ({ chatId, userId, content, isEmployee }) => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
        
        let result;
        if (isEmployee) {
          result = await db.query(
            `INSERT INTO EmployeeMessage (employee_id, chat_id, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, chatId, content]
          );
        } else {
          result = await db.query(
            `INSERT INTO UserMessage (user_id, chat_id, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, chatId, content]
          );
        }
    
        const message = result.rows[0];
        const userInfo = isEmployee 
          ? await db.query('SELECT first_name, last_name FROM Employee WHERE id = $1', [userId])
          : await db.query('SELECT first_name, last_name FROM "User" WHERE id = $1', [userId]);
    
        const fullMessage = {
          ...message,
          first_name: userInfo.rows[0].first_name,
          last_name: userInfo.rows[0].last_name,
          type: isEmployee ? 'employee' : 'user'
        };
    
        io.to(`chat_${chatId}`).emit('new-message', fullMessage);
      } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
      }
    });
    socket.on('disconnect', () => {
      console.log('Соединение WebSocket закрыто:', socket.id);
    });
  });
};