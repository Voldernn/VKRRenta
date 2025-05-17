import React from 'react';

const ChatForm = ({ formData, editMode, handleInputChange, handleSubmit, setEditMode }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название чата</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editMode ? 'Сохранить' : 'Создать'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => setEditMode(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ChatForm;