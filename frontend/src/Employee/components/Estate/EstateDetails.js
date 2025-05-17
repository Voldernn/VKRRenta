import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEstate } from '../../services/EstateService';

const EstateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estate, setEstate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEstate = async () => {
      try {
        const data = await getEstate(id);
        setEstate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEstate();
  }, [id]);

  const formatDate = (year) => {
    return year || 'Не указан';
  };

  const formatCurrency = (value) => {
    return value ? new Intl.NumberFormat('ru-RU').format(value) + ' ₽' : 'Не указана';
  };

  const formatContact = (value) => {
    return value || 'Не указан';
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!estate) return <div className="text-center py-8">Объект не найден</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Объект недвижимости #{estate.id}</h1>
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
            <h2 className="text-xl font-semibold mb-4">Основные характеристики</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Район:</p>
                <p>{estate.district}</p>
              </div>
              <div>
                <p className="font-medium">Количество комнат:</p>
                <p>{estate.rooms}</p>
              </div>
              <div>
                <p className="font-medium">Год постройки:</p>
                <p>{formatDate(estate.construction_year)}</p>
              </div>
              <div>
                <p className="font-medium">Общая площадь:</p>
                <p>{estate.total_area} м²</p>
              </div>
              <div>
                <p className="font-medium">Этажность дома:</p>
                <p>{estate.building_floors}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Финансовая информация</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Цена:</p>
                <p>{formatCurrency(estate.cost)}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">Контакты владельца</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Имя:</p>
                <p>{estate.first_name} {estate.last_name}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{formatContact(estate.email)}</p>
              </div>
            </div>
          </div>
        </div>

        {estate.description && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Описание объекта</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line">{estate.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstateDetails;