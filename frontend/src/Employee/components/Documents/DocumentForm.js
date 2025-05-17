import React from 'react';

const DocumentForm = ({ 
  documentData,
  users,
  onChange,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Редактировать документ' : 'Добавить новый документ'}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пользователь</label>
              <select
                name="user_id"
                value={documentData.user_id || ''}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
                required
                disabled={isEdit}
              >
                <option value="">Выберите пользователя</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название документа</label>
            <input
              type="text"
              name="document_name"
              value={documentData.document_name || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на документ</label>
            <input
              type="url"
              name="link"
              value={documentData.link || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://example.com/document.pdf"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              name="description"
              value={documentData.description || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {isEdit ? 'Сохранить' : 'Создать'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;