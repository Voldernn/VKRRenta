import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_URL = 'https://vkrrenta-production.up.railway.app';

const ChatManagement = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditChatModal, setShowEditChatModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [showAllChats, setShowAllChats] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [editChatName, setEditChatName] = useState('');
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(API_URL);
    fetchChats();
    fetchAllUsers();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/my`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const sortedChats = data.sort((a, b) => new Date(b.creation_time) - new Date(a.creation_time));
      setChats(sortedChats);
      if (sortedChats.length > 0 && !selectedChat) {
        setSelectedChat(sortedChats[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки чатов:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chat/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const sortedChats = data.sort((a, b) => new Date(b.creation_time) - new Date(a.creation_time));
      setChats(sortedChats);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки всех чатов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChat = async (chatId) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/chat/${chatId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
      
      if (showAllChats) {
        await fetchAllChats();
      } else {
        await fetchChats();
      }
      
      const joinedChat = chats.find(chat => chat.id === chatId) || 
                        (result.chat ? result.chat : null);
      if (joinedChat) {
        setSelectedChat(joinedChat);
      }
  
    } catch (err) {
      setError(err.message);
      console.error('Ошибка присоединения к чату:', err);
      setError(`Не удалось присоединиться к чату: ${err.message}`);
    }
  };

  const handleUpdateChatName = async () => {
    if (!selectedChat || !editChatName.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/chat/${selectedChat.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editChatName })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка обновления названия чата');
      }
      
      const updatedChat = await response.json();
      setChats(chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
      setSelectedChat(updatedChat);
      setShowEditChatModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка обновления чата:', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      const employeeId = localStorage.getItem('employeeId');
      socketRef.current.emit('join-chat', selectedChat.id, employeeId);
  
      const fetchChatData = async () => {
        try {
          const messagesResponse = await fetch(`${API_URL}/chat/${selectedChat.id}/messages`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
            }
          });
          
          if (!messagesResponse.ok) {
            throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
          }
          
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.reverse());
          
          const participantsResponse = await fetch(`${API_URL}/chat/${selectedChat.id}/participants`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
            }
          });
          
          const participantsData = await participantsResponse.json();
          // Ensure participantsData is an array
          setParticipants(Array.isArray(participantsData) ? participantsData : []);
        } catch (err) {
          setError(err.message);
        }
      };
      
      fetchChatData();
    }
  }, [selectedChat]);

  useEffect(() => {
    const socket = socketRef.current;
  
    const handleNewMessage = (message) => {
      if (message.chat_id === selectedChat?.id) {
        setMessages(prev => [message, ...prev]);
      }
    };
  
    socket.on('new-message', handleNewMessage);
  
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
  
    const employeeId = localStorage.getItem('employeeId');
    const employeeName = localStorage.getItem('employeeName');
  
    const messageData = {
      chatId: selectedChat.id,
      userId: employeeId,
      content: newMessage,
      isEmployee: true,
      first_name: employeeName?.split(' ')[0] || 'Сотрудник',
      last_name: employeeName?.split(' ')[1] || '',
      time: new Date().toISOString()
    };
  
    try {
      socketRef.current.emit('send-message', {
        chatId: selectedChat.id,
        userId: employeeId,
        content: newMessage,
        isEmployee: true
      });
      
      setNewMessage('');
    } catch (err) {
      setMessages(prev => prev.filter(m => m.time !== messageData.time));
      setError(err.message);
    }
  };

  const handleCreateChat = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify({ 
          userId,
          name: newChatName || `Чат ${new Date().toLocaleString()}`
        })
      });
      const data = await response.json();
      setChats(prev => [data, ...prev]);
      setSelectedChat(data);
      setShowCreateChatModal(false);
      setNewChatName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddUserToChat = async (userId) => {
    try {
      await fetch(`${API_URL}/chat/${selectedChat.id}/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        },
        body: JSON.stringify({ userId })
      });
      
      const participantsResponse = await fetch(`${API_URL}/chat/${selectedChat.id}/participants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`
        }
      });
      const participantsData = await participantsResponse.json();
      setParticipants(participantsData);
      setShowAddUserModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
    chat.id.toString().includes(chatSearchTerm)
  );

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 mt-4">
        <h1 className="text-2xl font-bold">Управление чатами</h1>
        <button 
          onClick={() => setShowCreateChatModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Создать новый чат
        </button>
      </div>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="flex h-[600px] border rounded-lg overflow-hidden">
        {/* Список чатов */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Поиск чатов..."
              className="w-full border rounded px-3 py-2"
              value={chatSearchTerm}
              onChange={(e) => setChatSearchTerm(e.target.value)}
            />
          </div>
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setShowAllChats(false);
                  fetchChats();
                }}
                className={`text-sm ${!showAllChats ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
              >
                Мои чаты
              </button>
              <button 
                onClick={() => {
                  setShowAllChats(true);
                  fetchAllChats();
                }}
                className={`text-sm ${showAllChats ? 'font-semibold text-blue-600' : 'text-gray-600'}`}
              >
                Все чаты
              </button>
            </div>
            <button 
              onClick={showAllChats ? fetchAllChats : fetchChats}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Обновить
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Нет доступных чатов</div>
            ) : (
              filteredChats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{chat.name}</h3>
                    {showAllChats && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinChat(chat.id);
                        }}
                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                      >
                        Присоединиться
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">ID: {chat.id}</p>
                  <p className="text-xs text-gray-400">
                    Создан: {new Date(chat.creation_time).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Окно чата */}
        <div className="w-2/3 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <button 
                    onClick={() => {
                      setEditChatName(selectedChat.name);
                      setShowEditChatModal(true);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    title="Редактировать название чата"
                  >
                    ✏️
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                  >
                    Добавить пользователя
                  </button>
                  <button 
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showParticipants ? 'Скрыть участников' : 'Показать участников'}
                  </button>
                </div>
              </div>
              
              {showParticipants && (
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium mb-2">Участники чата:</h3>
                  <div className="flex flex-wrap gap-2">
                    {participants.map((participant, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border text-sm flex items-center">
                        <span className="mr-1">
                          {participant.first_name} {participant.last_name}
                        </span>
                        <span className={`text-xs px-1 rounded ${participant.type === 'employee' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {participant.type === 'employee' ? 'Сотрудник' : 'Пользователь'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Сообщения */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.type === 'employee' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'employee' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      <div className="font-semibold">
                        {message.first_name} {message.last_name}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Форма отправки сообщения */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Введите сообщение..."
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Выберите чат для начала общения
            </div>
          )}
        </div>
      </div>
          
      {/* Модальное окно создания чата */}
      {showCreateChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Создать новый чат</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Название чата (необязательно)"
                className="w-full border rounded px-3 py-2 mb-2"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Поиск пользователя..."
                className="w-full border rounded px-3 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto mb-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCreateChat(user.id)}
                  >
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">Пользователи не найдены</div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowCreateChatModal(false);
                  setSearchTerm('');
                  setNewChatName('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования чата */}
      {showEditChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Редактировать название чата</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Новое название чата"
                className="w-full border rounded px-3 py-2"
                value={editChatName}
                onChange={(e) => setEditChatName(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditChatModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateChatName}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления пользователя в чат */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Добавить пользователя в чат</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Поиск пользователя..."
                className="w-full border rounded px-3 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto mb-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddUserToChat(user.id)}
                  >
                    <div className="font-medium">{user.first_name} {user.last_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">Пользователи не найдены</div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setSearchTerm('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;