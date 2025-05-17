import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from './services/UserService';
import UserForm from './components/User/UserForm';
import UserList from './components/User/UserList';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    age: ''
  });
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('авторизации')) {
          navigate('/employee/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedUser;
      
      if (editMode) {
        updatedUser = await updateUser(editMode, {
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: formData.age
        });
      } else {
        updatedUser = await createUser(formData);
      }

      setUsers(prev => 
        editMode 
          ? prev.map(user => user.id === editMode ? updatedUser : user)
          : [...prev, updatedUser]
      );

      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        age: ''
      });
      setEditMode(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditMode(user.id);
    setFormData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: '',
      age: user.age
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'Редактировать пользователя' : 'Создать пользователя'}
          </h2>
          <UserForm 
            formData={formData}
            editMode={editMode}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setEditMode={setEditMode}
          />
        </div>

        <div className="lg:col-span-3">
          <UserList 
            users={users}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;