const API_URL = 'https://vkrrenta-production.up.railway.app/contract';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('employeeToken');
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка запроса');
  }

  return response.json();
};

export const getContracts = async () => {
  return fetchWithAuth(`${API_URL}/all`);
};

export const getUserContracts = async (userId) => {
  return fetchWithAuth(`${API_URL}/user/${userId}`);
};

export const createContract = async (contractData) => {
  return fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(contractData)
  });
};

export const updateContract = async (id, contractData) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contractData)
  });
};

export const getContract = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('employeeToken')}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      const error = await response.text(); // Читаем текст ошибки
      throw new Error(error.includes('<!DOCTYPE html>') 
        ? 'Сервер вернул HTML вместо JSON. Проверьте URL и права доступа.'
        : error);
    }
  
    return response.json();
  };