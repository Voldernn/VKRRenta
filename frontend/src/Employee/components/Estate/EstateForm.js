import React, { useState, useEffect } from 'react';

const EstateForm = ({ 
  estate, 
  districts,
  onChange,
  onSubmit,
  onCancel
}) => {
  const [localDistricts, setLocalDistricts] = useState(districts || []);

  useEffect(() => {
    if (districts && districts.length > 0) {
      setLocalDistricts(districts);
    }
  }, [districts]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {estate.id ? 'Редактировать объект' : 'Создать объект'}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Район</label>
            <select
              name="district"
              value={estate.district || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Выберите район</option>
              {localDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Количество комнат</label>
            <input
              type="number"
              name="rooms"
              value={estate.rooms || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Год постройки</label>
            <input
              type="number"
              name="construction_year"
              value={estate.construction_year || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Общая площадь (м²)</label>
            <input
              type="number"
              name="total_area"
              value={estate.total_area || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              step="0.1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Этажность дома</label>
            <input
              type="number"
              name="building_floors"
              value={estate.building_floors || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
            <input
              type="number"
              name="cost"
              value={estate.cost || ''}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
              min="0"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea
            name="description"
            value={estate.description || ''}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
            rows="3"
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {estate.id ? 'Сохранить' : 'Создать'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EstateForm;