require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const createAdmin = async () => {
  try {
    const adminData = {
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'System',
      password: 'SecureAdminPassword123!',
      role: 'admin'
    };

    // Проверяем, существует ли уже админ
    const existingAdmin = await db.query(
      'SELECT * FROM Employee WHERE email = $1',
      [adminData.email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Администратор уже существует');
      process.exit(0);
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Создаем администратора
    await db.query(
      `INSERT INTO Employee (email, first_name, last_name, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        adminData.email,
        adminData.first_name,
        adminData.last_name,
        hashedPassword,
        adminData.role
      ]
    );

    console.log('Администратор успешно создан');
    console.log('Email:', adminData.email);
    console.log('Пароль:', adminData.password);
    console.log('ВАЖНО: Смените пароль после первого входа!');

  } catch (error) {
    console.error('Ошибка создания администратора:', error.message);
  } finally {
    process.exit(0);
  }
};

createAdmin();