import React, { useState, useEffect } from 'react';
import EstateForm from './EstateForm';
import { useAuth } from '../../AuthContext';
import { fetchEstates, updateEstate, addEstate, calculateRent } from './EstateService';

const districts = [
    'Аэропорт',
    'Академический',
    'Алексеевский',
    'Алтуфьевский',
    'Арбат',
    'Бабушкинский',
    'Басманный',
    'Беговой',
    'Бекасово',
    'Бескудниковский',
    'Бибирево',
    'Бирюлёво Восточное',
    'Бирюлёво Западное',
    'Богородское',
    'Братеево',
    'Бутырский',
    'Внуково',
    'Восточное Дегунино',
    'Восточное Измайлово',
    'Восточный',
    'Вороново',
    'Выхино-Жулебино',
    'Гагаринский',
    'Головинский',
    'Гольяново',
    'Даниловский',
    'Дмитровский',
    'Донской',
    'Дорогомилово',
    'Замоскворечье',
    'Западное Дегунино',
    'Зюзино',
    'Зябликово',
    'Ивановское',
    'Измайлово',
    'Капотня',
    'Коптево',
    'Косино-Ухтомский',
    'Краснопахорский',
    'Красносельский',
    'Крылатское',
    'Крюково',
    'Кузьминки',
    'Кунцево',
    'Куркино',
    'Левобережный',
    'Лефортово',
    'Лианозово',
    'Ломоносовский',
    'Лосиноостровский',
    'Люблино',
    'Марфино',
    'Марьина Роща',
    'Марьино',
    'Матушкино',
    'Метрогородок',
    'Мещанский',
    'Митино',
    'Можайский',
    'Молжаниновский',
    'Нагатино-Садовники',
    'Нагатинский Затон',
    'Нагорный',
    'Некрасовка',
    'Нижегородский',
    'Новогиреево',
    'Новокосино',
    'Ново-Переделкино',
    'Обручевский',
    'Орехово-Борисово Северное',
    'Орехово-Борисово Южное',
    'Останкинский',
    'Отрадное',
    'Очаково-Матвеевское',
    'Перово',
    'Печатники',
    'Покровское-Стрешнево',
    'Преображенское',
    'Пресненский',
    'Проспект Вернадского',
    'Раменки',
    'Ростокино',
    'Рязанский',
    'Савёлки',
    'Савёловский',
    'Свиблово',
    'Северное Бутово',
    'Северное Измайлово',
    'Северное Медведково',
    'Северное Тушино',
    'Северный',
    'Силино',
    'Сокол',
    'Соколиная Гора',
    'Сокольники',
    'Солнцево',
    'Старое Крюково',
    'Строгино',
    'Таганский',
    'Тверской',
    'Текстильщики',
    'Тёплый Стан',
    'Тимирязевский',
    'Троицк',
    'Тропарёво-Никулино',
    'Фили-Давыдково',
    'Филёвский Парк',
    'Филимонковский',
    'Хамовники',
    'Ховрино',
    'Хорошёвский',
    'Хорошёво-Мнёвники',
    'Царицыно',
    'Черёмушки',
    'Чертаново Северное',
    'Чертаново Центральное',
    'Чертаново Южное',
    'Щукино',
    'Щербинка',
    'Южное Бутово',
    'Южное Медведково',
    'Южное Тушино',
    'Южнопортовый',
    'Якиманка',
    'Ярославский',
    'Ясенево'
  ];

  const EstateList = () => {
    const { user } = useAuth();
    const [estates, setEstates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [formData, setFormData] = useState({
      rooms: '',
      construction_year: '',
      total_area: '',
      building_floors: '',
      district: ''
    });
    const [calculationResult, setCalculationResult] = useState(null);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          const token = localStorage.getItem('token');
          const estatesData = await fetchEstates(token);
          setEstates(estatesData);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      if (user) loadData();
    }, [user]);


    const handleCalculateRent = async (estateId) => {
      try {
        const token = localStorage.getItem('token');
        const result = await calculateRent(estateId, token);
        setCalculationResult({ 
          ...result, 
          estateId,
          show: true 
        });
      } catch (err) {
        setError(err.message);
      }
    };
  
  const handleEditClick = (estate) => {
    setEditMode(estate.id);
    setFormData({
      rooms: estate.rooms,
      construction_year: estate.construction_year,
      total_area: estate.total_area,
      building_floors: estate.building_floors,
      district: estate.district
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, estateId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedEstate = await updateEstate(estateId, formData, token);
      setEstates(estates.map(e => e.id === estateId ? updatedEstate : e));
      setEditMode(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddEstate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newEstate = await addEstate(formData, token);
      setEstates([...estates, newEstate]);
      setFormData({
        rooms: '',
        construction_year: '',
        total_area: '',
        building_floors: '',
        district: ''
      });
      setEditMode(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setEditMode('new')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Добавить недвижимость
        </button>
      </div>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading ? (
        <p>Загрузка...</p>
      ) : estates.length === 0 && editMode !== 'new' ? (
        <p>У вас пока нет добавленной недвижимости</p>
      ) : (
        <div className="space-y-4">
          {estates.map(estate => (
            <div key={estate.id} className="border rounded-lg p-4 mb-4">
              {editMode === estate.id ? (
                <EstateForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={(e) => handleSubmit(e, estate.id)}
                  handleCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-semibold">Комнат:</span> {estate.rooms}
                    </div>
                    <div>
                      <span className="font-semibold">Год постройки:</span> {estate.construction_year}
                    </div>
                    <div>
                      <span className="font-semibold">Общая площадь:</span> {estate.total_area} м²
                    </div>
                    <div>
                      <span className="font-semibold">Этажей в доме:</span> {estate.building_floors}
                    </div>
                    <div>
                      <span className="font-semibold">Район:</span> {estate.district}
                    </div>
                  </div>
                      <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(estate)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleCalculateRent(estate.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Рассчитать ренту
                    </button>
                  </div>

                  {calculationResult?.show && calculationResult.estateId === estate.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Результаты расчета:</h4>
                      <p>Единовременный платеж: {calculationResult.oneTimePayment.toLocaleString()} ₽</p>
                      <p>Ежемесячный платеж: {calculationResult.monthlyPayment.toLocaleString()} ₽</p>
                      <p class="text-xs text-gray-500 mt-2">Эти данные являются приблизительной оценкой. Точная сумма платежей озвучивается после личного осмотра недвижимости.</p>
                      <button
                        onClick={() => setCalculationResult(null)}
                        className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Скрыть
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {editMode === 'new' && (
        <div className="border rounded-lg p-4 mb-8">
          <h3 className="text-xl font-semibold mb-4">Добавить новую недвижимость</h3>
          <EstateForm
            formData={formData}
            districts={districts}
            handleInputChange={handleInputChange}
            handleSubmit={handleAddEstate}
            handleCancel={() => setEditMode(null)}
            submitButtonText="Добавить"
          />
        </div>
      )}
    </div>
  );
};

export default EstateList;