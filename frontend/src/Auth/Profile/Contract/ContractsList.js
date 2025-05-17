// ContractsList.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { fetchUserContracts } from './ContractService';

const ContractsList = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const contractsData = await fetchUserContracts(token, user.id);
        setContracts(contractsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  if (loading) return <div className="text-center">Загрузка договоров...</div>;
  if (error) return <div className="text-red-500 text-center">Ошибка: {error}</div>;

  return (
    <div className="space-y-4">
      {contracts.length === 0 ? (
        <div className="text-gray-500 text-center">У вас пока нет договоров</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Статус</th>
                <th className="py-2 px-4 border-b">Описание</th>
                <th className="py-2 px-4 border-b">Ежемесячный платеж</th>
                <th className="py-2 px-4 border-b">Разовый платеж</th>
                <th className="py-2 px-4 border-b">Общая сумма</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contract.status === 'active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contract.status === 'active' ? 'Активен' :
                       contract.status === 'pending' ? 'Ожидание' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{contract.description}</td>
                  <td className="py-2 px-4 border-b text-center">{contract.monthly_payment}</td>
                  <td className="py-2 px-4 border-b text-center">{contract.one_time_payment}</td>
                  <td className="py-2 px-4 border-b text-center">{contract.total_payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContractsList;