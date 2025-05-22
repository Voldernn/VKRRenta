const API_URL = 'https://vkrrenta.onrender.com/admin/chats';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('employeeToken');
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Ошибка запроса');
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  return response.json();
};

export const getChats = async () => {
  return fetchWithAuth(API_URL);
};

export const getChat = async (id) => {
  return fetchWithAuth(`${API_URL}/${id}`);
};

export const createChat = async (chatData) => {
  return fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(chatData),
  });
};

export const updateChat = async (id, chatData) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(chatData),
  });
};

export const deleteChat = async (id) => {
  await fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return { success: true };
};