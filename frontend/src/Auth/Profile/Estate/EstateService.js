export const fetchEstates = async (token) => {
    const response = await fetch('http://localhost:3001/estate/my', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки недвижимости');
    return await response.json();
  };
  
  export const updateEstate = async (estateId, formData, token) => {
    const response = await fetch(`http://localhost:3001/estate/${estateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка обновления');
    }
  
    return await response.json();
  };
  
  export const addEstate = async (formData, token) => {
    const response = await fetch('http://localhost:3001/estate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка добавления');
    }
  
    return await response.json();
  };
  export const calculateRent = async (estateId, token) => {
    const response = await fetch(`http://localhost:3001/cost/usercalculate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estateId })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка расчета ренты');
    }
  
    return await response.json();
  };