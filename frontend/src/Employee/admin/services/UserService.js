const API_URL = 'http://localhost:3001/admin/users';

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
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка запроса');
  }

  return response.json();
};

export const getUsers = async () => {
  return fetchWithAuth(API_URL);
};

export const getUser = async (id) => {
  return fetchWithAuth(`${API_URL}/${id}`);
};

export const createUser = async (userData) => {
  return fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id, userData) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const updateUserPassword = async (id, password) => {
  return fetchWithAuth(`${API_URL}/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
};

export const deleteUser = async (id) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};