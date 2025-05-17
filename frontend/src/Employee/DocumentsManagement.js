import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocuments, createDocument, updateDocument } from './services/DocumentService';
import { getUsers } from './services/UserService';
import DocumentList from './components/Documents/DocumentList';
import DocumentForm from './components/Documents/DocumentForm';

const DocumentsManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    document_name: '',
    link: '',
    description: ''
  });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsData, usersData] = await Promise.all([
          getDocuments(),
          getUsers()
        ]);
        setDocuments(docsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editMode]); // Зависимость от editMode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDocument = await createDocument(formData);
      setDocuments([...documents, newDocument]);
      setFormData({
        user_id: '',
        document_name: '',
        link: '',
        description: ''
      });
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedDocument = await updateDocument(formData.id, formData);
      setDocuments(documents.map(doc => 
        doc.id === formData.id ? updatedDocument : doc
      ));
      setEditMode(false);
      setFormData({ user_id: '', document_name: '', link: '', description: '' }); // Сброс формы
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (document) => {
    setFormData({
      id: document.id,
      user_id: document.user_id,
      document_name: document.document_name,
      link: document.link,
      description: document.description
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      user_id: '',
      document_name: '',
      link: '',
      description: ''
    });
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление документами</h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Добавить документ
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {editMode ? (
        <DocumentForm
          documentData={formData}
          users={users}
          onChange={handleInputChange}
          onSubmit={formData.id ? handleUpdateSubmit : handleCreateSubmit}
          onCancel={handleCancel}
          isEdit={!!formData.id}
        />
      ) : (
        <DocumentList 
          documents={documents} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default DocumentsManagement;