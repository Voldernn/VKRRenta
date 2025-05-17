const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен', error: error.message });
  }
};

const authenticateEmployee = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.role) {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }
    req.employee = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Неверный токен', error: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.employee.role !== 'admin') {
    return res.status(403).json({ message: 'Требуются права администратора' });
  }
  next();
};

module.exports = {
  authenticateUser,
  authenticateEmployee,
  isAdmin
};