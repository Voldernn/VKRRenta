const API_URL = 'http://localhost:3001/admin/employees';

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

export const getEmployees = async () => {
  return fetchWithAuth(API_URL);
};

export const getEmployee = async (id) => {
  return fetchWithAuth(`${API_URL}/${id}`);
};

export const createEmployee = async (employeeData) => {
  return fetchWithAuth(API_URL, {
    method: 'POST',
    body: JSON.stringify(employeeData),
  });
};

export const updateEmployee = async (id, employeeData) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  });
};

export const updateEmployeePassword = async (id, password) => {
  return fetchWithAuth(`${API_URL}/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify({ password }),
  });
};

export const deleteEmployee = async (id) => {
  return fetchWithAuth(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
};