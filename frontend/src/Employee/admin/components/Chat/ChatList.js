import React from 'react';

const ChatList = ({ chats, handleEdit, handleDelete }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата создания</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chats.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Нет чатов</td>
                </tr>
              ) : (
                chats.map(chat => (
                  <tr key={chat.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {chat.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(chat.creation_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(chat)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(chat.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatList;