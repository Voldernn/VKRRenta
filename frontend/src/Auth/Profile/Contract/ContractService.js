// ContractService.js
export const fetchUserContracts = async (token, userId) => {
    const response = await fetch(`https://vkrrenta.onrender.com/contract/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки контрактов');
    return await response.json();
  };
  
  export const createContract = async (contractData, token) => {
    const response = await fetch('https://vkrrenta.onrender.com/contract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(contractData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка создания контракта');
    }
  
    return await response.json();
  };
  
  export const fetchContractDetails = async (contractId, token) => {
    const response = await fetch(`https://vkrrenta.onrender.com/contract/${contractId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Ошибка загрузки данных контракта');
    return await response.json();
  };