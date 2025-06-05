const API_URL = 'https://vkrrenta-production.up.railway.app/estate';

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

export const getEstates = async () => {
  return fetchWithAuth(`${API_URL}/all`);
};

export const getEstate = async (id) => {
  return fetchWithAuth(`${API_URL}/${id}`);
};

export const updateEstate = async (id, estateData) => {
  return fetchWithAuth(`${API_URL}/${id}/admin`, {
    method: 'PUT',
    body: JSON.stringify(estateData)
  });
};

export const getDistricts = async () => {
  return fetchWithAuth('https://vkrrenta.onrender.com/districts');
};