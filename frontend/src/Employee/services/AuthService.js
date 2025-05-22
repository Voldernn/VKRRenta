const API_URL = 'https://vkrrenta.onrender.com/employee';


export const loginEmployee = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('employeeToken', data.token);
    localStorage.setItem('employeeId', data.employee.id); // Исправлено: берем id из data.employee
    return data;
  } else {
    throw new Error(data.message || 'Ошибка авторизации');
  }
};

export const getEmployeeProfile = async () => {
  const token = localStorage.getItem('employeeToken');
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ошибка получения профиля');
  }

  return response.json();
};