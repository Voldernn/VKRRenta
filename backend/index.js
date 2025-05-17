// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); 
const socketio = require('socket.io'); // Для веб-сокета

const userAuthRoutes = require('./Users/auth');
const userRoutes = require('./Users/users'); 
const employeeRoutes = require('./Employees/employee');
const estateRoutes = require('./Estate/estate');
const contractRoutes = require('./Contracts/contract');
const documentRoutes = require('./Documents/document');
const chatRoutes = require('./Chats/chat');
const costRoutes = require('./Cost/cost');
const districtRoutes = require('./Districts/district');
const adminEmployeeRoutes = require('./Admin/employees');
const adminUsersRoutes = require('./Admin/users');
const adminChatsRoutes = require('./Admin/chats');
const app = express();
const server = http.createServer(app); // Создаем HTTP сервер
const io = socketio(server, { // Инициализируем socket.io
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

require('./Chats/chatSocket')(io);

app.use('/auth', userAuthRoutes);
//app.use('/users', userRoutes); 
app.use('/employee', employeeRoutes);
app.use('/estate', estateRoutes);
app.use('/contract', contractRoutes);
app.use('/document', documentRoutes);
app.use('/chat', chatRoutes);
app.use('/cost', costRoutes);
app.use('/districts', districtRoutes);
app.use('/admin/employees', adminEmployeeRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/chats', adminChatsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});