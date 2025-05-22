// DocumentService.js
export const fetchUserDocuments = async (token, userId) => {
    const response = await fetch(`https://vkrrenta.onrender.com/document/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка загрузки документов');
    }
    return await response.json();
  };
  
  export const updateDocumentLink = async (documentId, newLink, token) => {
    const response = await fetch(`https://vkrrenta.onrender.com/document/link/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ link: newLink }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка обновления ссылки');
    }
  
    return await response.json();
  };