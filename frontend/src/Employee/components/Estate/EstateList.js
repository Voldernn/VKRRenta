import React from 'react';
import { Link } from 'react-router-dom';

const EstateList = ({ estates, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Владелец</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контакты</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Район</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estates.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Нет объектов недвижимости</td>
              </tr>
            ) : (
              estates.map(estate => (
                <tr key={estate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{estate.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {estate.first_name} {estate.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{estate.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{estate.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {estate.cost ? (
                      <span className="font-medium">
                        {new Intl.NumberFormat('ru-RU').format(estate.cost)} ₽
                      </span>
                    ) : (
                      <span className="text-gray-400">Не указана</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link 
                      to={`/employee/dashboard/estates/${estate.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Просмотр
                    </Link>
                    <button
                      onClick={() => onEdit(estate)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Изменить
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

export default EstateList;