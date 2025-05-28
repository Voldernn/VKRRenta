import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { getEmployeeProfile } from './services/AuthService';
import ContractsManagement from './ContractsManagement';
import ContractDetails from './components/Contracts/ContractDetails';
import EstatesManagement from './EstatesManagement';
import EstateDetails from './components/Estate/EstateDetails';
import DocumentsManagement from './DocumentsManagement';
import ChatManagement from './ChatManagement';
import AdminEmployeesManagement from './admin/EmployeesManagement';
import AdminUsersManagement from './admin/UsersManagement';
import AdminChatsManagement from './admin/ChatsManagement';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await getEmployeeProfile();
        setEmployee(data);
      } catch (error) {
        setError(error.message);
        localStorage.removeItem('employeeToken');
        navigate('/employee/');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    navigate('/employee');
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Личный кабинет сотрудника</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Выйти
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Личные данные</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Имя:</p>
            <p>{employee.first_name}</p>
          </div>
          <div>
            <p className="font-medium">Фамилия:</p>
            <p>{employee.last_name}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{employee.email}</p>
          </div>
          <div>
            <p className="font-medium">Должность:</p>
            <p>{employee.role}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Инструменты для менеджера</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/employee/dashboard/contracts')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Управление договорами
            </button>
            <button 
              onClick={() => navigate('/employee/dashboard/estates')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Управление квартирами
            </button>
            <button 
              onClick={() => navigate('/employee/dashboard/documents')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Управление документами
            </button>
            <button 
              onClick={() => navigate('/employee/dashboard/chat')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Чат
            </button>
          </div>
        </div>
      {employee.role === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Администрирование</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/employee/dashboard/admin/employees')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Управление сотрудниками
            </button>
            <button 
              onClick={() => navigate('/employee/dashboard/admin/users')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Управление пользователями
            </button>
            <button 
              onClick={() => navigate('/employee/dashboard/admin/chats')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Управление чатами
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="contracts" element={<ContractsManagement />} />
        <Route path="contracts/:id" element={<ContractDetails />} />
        <Route path="estates" element={<EstatesManagement />} />
        <Route path="estates/:id" element={<EstateDetails />} />
        <Route path="documents" element={<DocumentsManagement />} />
        <Route path="chat" element={<ChatManagement />} />
        <Route path="admin/employees" element={<AdminEmployeesManagement />} />
        <Route path="admin/users" element={<AdminUsersManagement />} />
        <Route path="admin/chats" element={<AdminChatsManagement />} />
      </Routes>
    </div>
  );
};

export default EmployeeDashboard;