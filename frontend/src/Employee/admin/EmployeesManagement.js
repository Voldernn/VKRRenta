import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './services/EmployeeService';
import EmployeeForm from './components/Employee/EmployeeForm';
import EmployeeList from './components/Employee/EmployeeList';

const EmployeesManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'manager'
  });
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('авторизации')) {
          navigate('/employee/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedEmployee;
      
      if (editMode) {
        updatedEmployee = await updateEmployee(editMode, {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role
        });
      } else {
        updatedEmployee = await createEmployee(formData);
      }

      setEmployees(prev => 
        editMode 
          ? prev.map(emp => emp.id === editMode ? updatedEmployee : emp)
          : [...prev, updatedEmployee]
      );

      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'manager'
      });
      setEditMode(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditMode(employee.id);
    setFormData({
      email: employee.email,
      first_name: employee.first_name,
      last_name: employee.last_name,
      password: '',
      role: employee.role
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;
    
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Управление сотрудниками</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Форма добавления сотрудника */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </h2>
          <EmployeeForm 
            formData={formData}
            editMode={editMode}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setEditMode={setEditMode}
          />
        </div>

        {/* Список сотрудников */}
        <div className="lg:col-span-3">
          <EmployeeList 
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeesManagement;