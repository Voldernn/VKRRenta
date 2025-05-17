const API_URL = 'http://localhost:3001/document';

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

export const getDocuments = async () => {
  return fetchWithAuth(`${API_URL}/all`);
};

export const createDocument = async (documentData) => {
  return fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(documentData)
  });
};

export const updateDocument = async (id, documentData) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(documentData)
  });
};