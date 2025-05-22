import React, { useState } from "react";

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

const Calculator = () => {
  const [district, setDistrict] = useState("");
  const [rooms, setRooms] = useState(1);
  const [totalArea, setTotalArea] = useState(20);
  const [constructionYear, setConstructionYear] = useState(2000);
  const [buildingFloors, setBuildingFloors] = useState(1);
  const [userAge, setUserAge] = useState(65);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const calculateRent = async () => {
    try {
      const response = await fetch("https://vkrrenta.onrender.com/cost/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district,
          rooms: Number(rooms),
          totalArea: Number(totalArea),
          constructionYear: Number(constructionYear),
          buildingFloors: Number(buildingFloors),
          userAge: Number(userAge),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || ['Ошибка при расчете']);
        setResult(null);
        return;
      }

      const data = await response.json();
      setResult(data);
      setErrors([]);
    } catch (error) {
      console.error(error);
      setErrors(['Ошибка соединения с сервером']);
      setResult(null);
    }
  };

  return (
    <div>
      <main className="container mx-auto py-12 px-6">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">Калькулятор ренты</h2>
        
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Введите данные для расчета</h3>
          
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Район:</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Выберите район</option>
                {districts.map((districtName, index) => (
                  <option key={index} value={districtName}>
                    {districtName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Количество комнат (1-4):</label>
              <input 
                type="number" 
                value={rooms} 
                onChange={(e) => setRooms(e.target.value)} 
                min="1" 
                max="4"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Общая площадь (20-100 кв. м):</label>
              <input 
                type="number" 
                value={totalArea} 
                onChange={(e) => setTotalArea(e.target.value)} 
                min="20" 
                max="100"
                step="0.1"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Год постройки:</label>
              <input 
                type="number" 
                value={constructionYear} 
                onChange={(e) => setConstructionYear(e.target.value)} 
                min="1940"
                max={new Date().getFullYear()}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Этажность здания (1-30):</label>
              <input 
                type="number" 
                value={buildingFloors} 
                onChange={(e) => setBuildingFloors(e.target.value)} 
                min="1" 
                max="30"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Ваш возраст (65-100):</label>
              <input 
                type="number" 
                value={userAge} 
                onChange={(e) => setUserAge(e.target.value)} 
                min="65" 
                max="100"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          
          <button 
            onClick={calculateRent} 
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Рассчитать
          </button>
          
          {result && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Результаты:</h3>
              <p>Единовременный платеж: <span className="font-semibold">{result.oneTimePayment}</span></p>
              <p>Ежемесячный платеж: <span className="font-semibold">{result.monthlyPayment}</span></p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calculator;