// components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../AuthContext';
import io from 'socket.io-client';

const API_URL = 'http://localhost:3001';
const Chat = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChatNameModal, setShowChatNameModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Инициализация WebSocket соединения
    socketRef.current = io(API_URL || 'http://localhost:3001');

    // Загрузка списка чатов
    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_URL}/chat/my`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Ошибка ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        // Сортировка чатов по дате создания (предполагается, что у чата есть поле createdAt)
        const sortedChats = data.sort((a, b) => new Date(b.creation_time) - new Date(a.creation_time));
        setChats(sortedChats);
        if (sortedChats.length > 0) {
          setSelectedChat(sortedChats[0]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки чатов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      // Присоединяемся к чату через WebSocket
      socketRef.current.emit('join-chat', selectedChat.id, user.id);
  
      // Загружаем историю сообщений
      const fetchMessages = async () => {
        try {
          const response = await fetch(`${API_URL}/chat/${selectedChat.id}/messages`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setMessages(data.reverse());
          
          // Загружаем участников чата
          const participantsResponse = await fetch(`${API_URL}/chat/${selectedChat.id}/participants`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const participantsData = await participantsResponse.json();
          setParticipants(participantsData);
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchMessages();
    }
  }, [selectedChat, user.id]);

  useEffect(() => {
    const socket = socketRef.current;
  
    const handleNewMessage = (message) => {
      if (message.chat_id === selectedChat?.id) {
        setMessages(prev => {
          // Удаляем временное сообщение, если есть
          const filtered = prev.filter(m => !m.tempId || m.tempId !== message.tempId);
          return [message, ...filtered];
        });
      }
    };
  
    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
  
    const messageData = {
      chatId: selectedChat.id,
      userId: user.id,
      content: newMessage,
      isEmployee: user.role && user.role !== 'user',
      type: user.role && user.role !== 'user' ? 'employee' : 'user',
      first_name: user.first_name,
      last_name: user.last_name,
      time: new Date().toISOString()
    };
  
    try {
      // Отправка только через сокет
      socketRef.current.emit('send-message', messageData);
      
      setNewMessage('');
    } catch (err) {
      // Откатываем оптимистичное обновление при ошибке
      setMessages(prev => prev.filter(m => m.time !== messageData.time));
      setError(err.message);
    }
  };

  const handleCreateChat = async () => {
    setShowChatNameModal(true);
  };

  const confirmCreateChat = async () => {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newChatName || `Чат с поддержкой` })
      });
      const data = await response.json();
      setChats(prevChats => [data, ...prevChats]);
      setSelectedChat(data);
      setShowChatNameModal(false);
      setNewChatName('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="flex flex-col h-full">
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* Модальное окно для ввода названия чата */}
      {showChatNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Создать новый чат</h3>
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="Введите название чата"
              className="w-full border rounded px-3 py-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowChatNameModal(false);
                  setNewChatName('');
                }}
                className="px-4 py-2 border rounded"
              >
                Отмена
              </button>
              <button
                onClick={confirmCreateChat}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Мои чаты</h3>
        <button 
          onClick={handleCreateChat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Новый чат
        </button>
      </div>

      <div className="flex h-[500px] border rounded-lg overflow-hidden">
        {/* Список чатов */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
            <div className="p-4 border-b">
            <h2 className="font-semibold">Доступные чаты</h2>
            
            </div>
            <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Нет доступных чатов</div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <h3 className="font-medium">{chat.name}</h3>
                  <p className="text-sm text-gray-500">ID: {chat.id}</p>
                  <p className="text-xs text-gray-400">Создан: {new Date(chat.creation_time).toLocaleString()}</p>
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
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <button 
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showParticipants ? 'Скрыть участников' : 'Показать участников'}
                </button>
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
                    className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.user_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
    </div>
  );
};

export default Chat;