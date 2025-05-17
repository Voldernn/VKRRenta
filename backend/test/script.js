const API_BASE_URL = 'http://localhost:3001';
let authToken = null;
let currentUser = null;
let currentChatId = null;
let socket = null;

// DOM элементы
const authSection = document.getElementById('auth-section');
const chatSection = document.getElementById('chat-section');
const connectionStatus = document.getElementById('connection-status');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const userTypeSelect = document.getElementById('user-type');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const chatNameInput = document.getElementById('chat-name');
const createChatBtn = document.getElementById('create-chat-btn');
const joinChatIdInput = document.getElementById('join-chat-id');
const joinChatBtn = document.getElementById('join-chat-btn');
const addUserIdInput = document.getElementById('add-user-id');
const addUserBtn = document.getElementById('add-user-btn');
const chatList = document.getElementById('chat-list');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const participantsList = document.getElementById('participants-list');

// Инициализация WebSocket соединения
function initSocket() {
    if (socket) {
        socket.disconnect();
    }

    socket = io(API_BASE_URL, {
        auth: {
            token: authToken
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
    });

    // Обработчики событий соединения
    socket.on('connect', () => {
        updateConnectionStatus('online', 'Подключен');
        console.log('WebSocket подключен');
    });

    socket.on('disconnect', (reason) => {
        updateConnectionStatus('offline', 'Отключен: ' + reason);
        console.log('WebSocket отключен:', reason);
    });

    socket.on('connect_error', (err) => {
        updateConnectionStatus('offline', 'Ошибка подключения');
        console.error('Ошибка подключения WebSocket:', err.message);
    });

    socket.on('reconnecting', (attempt) => {
        updateConnectionStatus('connecting', 'Переподключение...');
        console.log(`Попытка переподключения #${attempt}`);
    });

    // Обработчики чата
    socket.on('new-message', (message) => {
        console.log('Новое сообщение:', message);
        if (message.chat_id === currentChatId) {
            addNewMessage(message);
        }
    });

    socket.on('initial-messages', (messages) => {
        console.log('Получена история сообщений:', messages);
        if (currentChatId) {
            displayMessages(messages);
        }
    });
}

// Обновление статуса соединения
function updateConnectionStatus(status, text) {
    connectionStatus.classList.remove('hidden');
    statusIndicator.className = `status-indicator status-${status}`;
    statusText.textContent = text;
}

// Добавление нового сообщения в чат
function addNewMessage(message) {
    const messageElement = createMessageElement(message);
    messageElement.classList.add('new-message');
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Отображение списка сообщений
function displayMessages(messages) {
    messageContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = createMessageElement(msg);
        messageContainer.appendChild(messageElement);
    });
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Авторизация
loginBtn.addEventListener('click', async () => {
    const userType = userTypeSelect.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        alert('Введите email и пароль');
        return;
    }

    try {
        const endpoint = userType === 'employee' ? 'employees/login' : 'auth/login';
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        };

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        if (!response.ok) {
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.message || 'Неизвестная ошибка сервера';
            } catch (e) {
                errorText = await response.text();
            }
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.token) {
            throw new Error('Токен не получен от сервера');
        }
        
        authToken = data.token;
        currentUser = {
            id: data.user?.id || data.employee?.id,
            email: data.user?.email || data.employee?.email,
            first_name: data.user?.first_name || data.employee?.first_name,
            last_name: data.user?.last_name || data.employee?.last_name,
            role: userType === 'employee' ? (data.employee?.role || 'employee') : 'user'
        };

        authSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
        
        // Инициализируем WebSocket после авторизации
        initSocket();
        loadUserChats();
        
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        let errorMessage = 'Ошибка авторизации';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Не удалось подключиться к серверу. Проверьте соединение.';
        } else if (error.message.includes('401')) {
            errorMessage = 'Неверный email или пароль';
        } else {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    }
});

// Создание чата
createChatBtn.addEventListener('click', async () => {
    const chatName = chatNameInput.value.trim();
    
    try {
        const response = await fetch(`${API_BASE_URL}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: chatName || undefined
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            chatNameInput.value = '';
            loadUserChats();
            currentChatId = data.id;
            socket.emit('join-chat', data.id, currentUser.id);
        } else {
            alert(`Ошибка: ${data.message}`);
        }
    } catch (error) {
        console.error('Ошибка создания чата:', error);
        alert('Ошибка создания чата');
    }
});

// Присоединение к чату (для сотрудников)
joinChatBtn.addEventListener('click', async () => {
    const chatId = joinChatIdInput.value.trim();
    
    if (!chatId) {
        alert('Введите ID чата');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            joinChatIdInput.value = '';
            currentChatId = parseInt(chatId);
            socket.emit('join-chat', currentChatId, currentUser.id);
            loadUserChats();
        } else {
            alert(`Ошибка: ${data.message}`);
        }
    } catch (error) {
        console.error('Ошибка присоединения к чату:', error);
        alert('Ошибка присоединения к чату');
    }
});

// Добавление пользователя в чат (для сотрудников)
addUserBtn.addEventListener('click', async () => {
    const userId = addUserIdInput.value.trim();
    
    if (!currentChatId) {
        alert('Выберите чат');
        return;
    }
    
    if (!userId) {
        alert('Введите ID пользователя');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/chats/${currentChatId}/add-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                userId: userId
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            addUserIdInput.value = '';
            loadChatParticipants(currentChatId);
            alert('Пользователь добавлен в чат');
        } else {
            alert(`Ошибка: ${data.message}`);
        }
    } catch (error) {
        console.error('Ошибка добавления пользователя:', error);
        alert('Ошибка добавления пользователя');
    }
});

// Отправка сообщения через WebSocket
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText) {
        alert('Введите текст сообщения');
        return;
    }
    
    if (!currentChatId) {
        alert('Выберите чат для отправки сообщения');
        return;
    }

    try {
        socket.emit('send-message', {
            chatId: currentChatId,
            userId: currentUser.id,
            content: messageText,
            isEmployee: currentUser.role !== 'user'
        });

        messageInput.value = '';
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        alert(`Не удалось отправить сообщение: ${error.message}`);
    }
}

// Загрузка чатов пользователя
async function loadUserChats() {
    try {
        const response = await fetch(`${API_BASE_URL}/chats/my`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Не удалось загрузить чаты');
        }

        const chats = await response.json();
        chatList.innerHTML = '';

        if (chats.length === 0) {
            chatList.innerHTML = '<div class="no-chats">У вас пока нет чатов</div>';
            return;
        }

        chats.forEach(chat => {
            const chatElement = document.createElement('div');
            chatElement.className = 'chat-item';
            chatElement.dataset.chatId = chat.id;
            chatElement.textContent = chat.name || `Чат #${chat.id}`;
            
            chatElement.addEventListener('click', () => {
                currentChatId = chat.id;
                loadChatMessages(chat.id);
                loadChatParticipants(chat.id);
                
                document.querySelectorAll('.chat-item').forEach(item => {
                    item.classList.remove('active');
                });
                chatElement.classList.add('active');
                
                socket.emit('join-chat', chat.id, currentUser.id);
            });

            chatList.appendChild(chatElement);
        });

        if (currentChatId) {
            const currentChatElement = document.querySelector(`.chat-item[data-chat-id="${currentChatId}"]`);
            if (currentChatElement) {
                currentChatElement.classList.add('active');
                socket.emit('join-chat', currentChatId, currentUser.id);
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке чатов:', error);
        chatList.innerHTML = `<div class="error">Ошибка загрузки чатов: ${error.message}</div>`;
    }
}

// Загрузка сообщений чата через WebSocket
async function loadChatMessages(chatId) {
    if (!chatId) return;
    socket.emit('join-chat', chatId, currentUser.id);
}

// Создание элемента сообщения
function createMessageElement(msg) {
    const isCurrentUser = (msg.user_id === currentUser.id) || (msg.employee_id === currentUser.id);
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isCurrentUser ? 'own-message' : ''}`;
    
    let senderInfo = 'Неизвестный отправитель';
    if (msg.user_id) {
        senderInfo = `Пользователь: ${msg.first_name || 'ID:' + msg.user_id}`;
    } else if (msg.employee_id) {
        senderInfo = `Сотрудник: ${msg.first_name || 'ID:' + msg.employee_id}`;
        if (msg.role) senderInfo += ` (${msg.role})`;
    }

    const messageTime = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageElement.innerHTML = `
        <div class="message-header">
            <span class="sender">${senderInfo}</span>
            <span class="time">${messageTime}</span>
        </div>
        <div class="message-content">${msg.content}</div>
    `;
    
    return messageElement;
}

// Загрузка участников чата
async function loadChatParticipants(chatId) {
    try {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/participants`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(await response.text());
        }
        
        const participants = await response.json();
        
        participantsList.innerHTML = '';
        participants.forEach(participant => {
            const participantElement = document.createElement('div');
            participantElement.className = 'participant';
            participantElement.textContent = `${participant.first_name} ${participant.last_name} (${participant.type === 'user' ? 'Пользователь' : 'Сотрудник'})`;
            participantsList.appendChild(participantElement);
        });
    } catch (error) {
        console.error('Ошибка загрузки участников:', error);
    }
}