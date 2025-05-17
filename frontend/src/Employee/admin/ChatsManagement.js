import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChats, createChat, updateChat, deleteChat } from './services/ChatService';
import ChatForm from './components/Chat/ChatForm';
import ChatList from './components/Chat/ChatList';

const ChatsManagement = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: ''
  });
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChats();
        setChats(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('авторизации')) {
          navigate('/employee/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedChat;
      
      if (editMode) {
        updatedChat = await updateChat(editMode, formData);
      } else {
        updatedChat = await createChat(formData);
      }

      setChats(prev => 
        editMode 
          ? prev.map(chat => chat.id === editMode ? updatedChat : chat)
          : [updatedChat, ...prev]
      );

      setFormData({ name: '' });
      setEditMode(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (chat) => {
    setEditMode(chat.id);
    setFormData({
      name: chat.name
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот чат?')) return;
    
    try {
      await deleteChat(id);
      setChats(prev => prev.filter(chat => chat.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Управление чатами</h1>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? 'Редактировать чат' : 'Создать чат'}
          </h2>
          <ChatForm 
            formData={formData}
            editMode={editMode}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setEditMode={setEditMode}
          />
        </div>

        <div className="lg:col-span-3">
          <ChatList 
            chats={chats}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatsManagement;