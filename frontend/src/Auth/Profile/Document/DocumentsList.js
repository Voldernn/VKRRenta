// DocumentsList.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { fetchUserDocuments, updateDocumentLink } from './DocumentService';

const DocumentsList = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const documentsData = await fetchUserDocuments(token, user.id);
        setDocuments(documentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const handleEditClick = (document) => {
    setEditingId(document.id);
    setNewLink(document.link);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleLinkChange = (e) => {
    setNewLink(e.target.value);
  };

  const handleSaveLink = async (documentId) => {
    try {
      // Оптимистичное обновление - сразу меняем состояние
      const updatedDocuments = documents.map(doc => 
        doc.id === documentId ? { ...doc, link: newLink } : doc
      );
      setDocuments(updatedDocuments);
      setEditingId(null);

      // Затем отправляем запрос на сервер
      const token = localStorage.getItem('token');
      await updateDocumentLink(documentId, newLink, token);
      
    } catch (err) {
      // Если ошибка - возвращаем предыдущее состояние
      setError(err.message);
      const originalDocuments = documents.map(doc => 
        doc.id === documentId ? doc : doc
      );
      setDocuments(originalDocuments);
    }
  };

  if (loading) return <div className="text-center">Загрузка документов...</div>;
  if (error) return <div className="text-red-500 text-center">Ошибка: {error}</div>;

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-gray-500 text-center">У вас пока нет документов</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Название</th>
                <th className="py-2 px-4 border-b">Ссылка</th>
                <th className="py-2 px-4 border-b">Описание</th>
                <th className="py-2 px-4 border-b">Действия</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{document.document_name}</td>
                  <td className="py-2 px-4 border-b">
                    {editingId === document.id ? (
                      <input
                        type="text"
                        value={newLink}
                        onChange={handleLinkChange}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Введите новую ссылку"
                      />
                    ) : (
                      <a 
                        href={document.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {document.link}
                      </a>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{document.description}</td>
                  <td className="py-2 px-4 border-b">
                    {editingId === document.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveLink(document.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(document)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Изменить ссылку
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;