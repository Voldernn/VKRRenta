import React from 'react';
import { Link } from 'react-router-dom';

const ContractList = ({ contracts, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Общая сумма</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Нет контрактов</td>
              </tr>
            ) : (
              contracts.map(contract => (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contract.first_name} {contract.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contract.status === 'active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contract.status === 'active' ? 'Активен' :
                       contract.status === 'pending' ? 'Ожидание' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.total_payment} ₽</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link 
                      to={`/employee/dashboard/contracts/${contract.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Просмотр
                    </Link>
                    <button
                      onClick={() => onEdit(contract)}
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

export default ContractList;