import React from 'react';

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

  const EstateForm = ({
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitButtonText = 'Сохранить',
    cancelButtonText = 'Отмена'
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Комнат</label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Год постройки</label>
            <input
              type="number"
              name="construction_year"
              value={formData.construction_year}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Общая площадь (м²)</label>
            <input
              type="number"
              name="total_area"
              value={formData.total_area}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Этажей в доме</label>
            <input
              type="number"
              name="building_floors"
              value={formData.building_floors}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Район</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Выберите район</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitButtonText}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            {cancelButtonText}
          </button>
        </div>
      </form>
    );
  };

export default EstateForm;