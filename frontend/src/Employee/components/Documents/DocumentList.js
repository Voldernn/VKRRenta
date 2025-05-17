import React from 'react';
import { Link } from 'react-router-dom';

const DocumentList = ({ documents, onEdit }) => {
  const handleLinkClick = (e, link) => {
    e.preventDefault();
    if (link) window.open(link, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Владелец</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контакты</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Документ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Нет документов</td>
              </tr>
            ) : (
              documents.map(document => (
                <tr key={document.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{document.document_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {document.first_name} {document.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {document.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {document.link ? (
                      <a 
                        href={document.link} 
                        onClick={(e) => handleLinkClick(e, document.link)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Открыть документ
                      </a>
                    ) : (
                      <span className="text-gray-400">Не загружен</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {document.description || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => onEdit(document)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;