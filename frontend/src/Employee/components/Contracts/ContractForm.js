import React from 'react';

const ContractForm = ({ 
  contract, 
  users,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {contract.id ? 'Редактировать договор' : 'Создать договор'}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пользователь</label>
            <select
              name="user_id"
              value={contract.user_id || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={!!contract.id}
            >
              <option value="">Выберите пользователя</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              name="status"
              value={contract.status || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="active">Активен</option>
              <option value="pending">Ожидание</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              name="description"
              value={contract.description || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ежемесячный платеж (₽)</label>
              <input
                type="number"
                name="monthly_payment"
                value={contract.monthly_payment || ''}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Разовый платеж (₽)</label>
              <input
                type="number"
                name="one_time_payment"
                value={contract.one_time_payment || ''}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Общая сумма (₽)</label>
              <input
                type="number"
                name="total_payment"
                value={contract.total_payment || ''}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {contract.id ? 'Сохранить' : 'Создать'}
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

export default ContractForm;