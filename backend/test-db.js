const db = require('./db');

async function testConnection() {
  try {
    const res = await db.query('SELECT NOW() as current_time');
    console.log('✅ Подключение успешно! Текущее время в БД:', res.rows[0].current_time);
  } catch (err) {
    console.error('❌ Ошибка подключения:', err.message);
  }
}

testConnection();