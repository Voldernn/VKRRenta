import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContract } from '../../services/ContractService';

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await getContract(id);
        setContract(data);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки контракта:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return 'Неверный формат даты';
    }
  };

  const formatCurrency = (value) => {
    return value !== undefined && value !== null 
      ? `${parseFloat(value).toLocaleString('ru-RU')} ₽`
      : '0 ₽';
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!contract) return <div className="text-center py-8">Договор не найден</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Договор #{contract.id}</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Назад
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Пользователь:</p>
                <p>
                  {contract.user_id}
                  {contract.first_name && contract.last_name && 
                    ` (${contract.first_name} ${contract.last_name})`}
                </p>
              </div>
              <div>
                <p className="font-medium">Статус:</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  contract.status === 'active' ? 'bg-green-100 text-green-800' :
                  contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {contract.status === 'active' ? 'Активен' :
                   contract.status === 'pending' ? 'Ожидание' : 'Неактивен'}
                </span>
              </div>
              <div>
                <p className="font-medium">Дата создания:</p>
                <p>{formatDate(contract.created_at)}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Финансовая информация</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Ежемесячный платеж:</p>
                <p>{formatCurrency(contract.monthly_payment)}</p>
              </div>
              <div>
                <p className="font-medium">Разовый платеж:</p>
                <p>{formatCurrency(contract.one_time_payment)}</p>
              </div>
              <div>
                <p className="font-medium">Общая сумма:</p>
                <p>{formatCurrency(contract.total_payment)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Описание</h2>
          <p className="whitespace-pre-line bg-gray-50 p-3 rounded">
            {contract.description || 'Нет описания'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;