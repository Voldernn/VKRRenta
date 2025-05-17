// Main.js
import React from "react";
import Layout from "./Layout";

const Main = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <img src="Main.png" alt="People discussing" className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Заключите договор ренты с надежной компанией</h1>
          <p className="text-lg md:text-2xl mb-6">Более 20-лет предоставляем лучшие условия по выплатам</p>
        </div>
      </section>
      {/* Main Content */}
      <main className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">Московская городская служба ренты</h2>
          <p className="text-lg mb-8 text-center">
            Заключите договор ренты с надежной компанией!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="mb-4">
              Служба ренты существует в Москве уже более 20 лет, за это время организация помогла тысячам Москвичей оформить договор пожизненной ренты на лучших условиях.
            </p>
            <p>
              Сегодня МГСР предлагает самые крупные выплаты по ренте в Москве и подмосковье, сохраняя при этом высокие стандарты качества обслуживания клиентов.
            </p>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Почему нам доверяют</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Преимущество 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Опыт</h4>
              <p>МГСР работает в Москве с 2003 года</p>
            </div>
            
            {/* Преимущество 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Лучшие условия</h4>
              <p>Московская служба ренты предлагает самые крупные выплаты по ренте в Москве</p>
            </div>
            
            {/* Преимущество 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Помощь 24/7</h4>
              <p>Служба ренты имеет круглосуточную горячую линию помощи</p>
            </div>
            
            {/* Преимущество 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Забота</h4>
              <p>Мы помогаем вам по всем вопросам: бытовым и юридическим</p>
            </div>
            
            {/* Преимущество 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Надежность</h4>
              <p>Репутация, заработанная годами работы, крупные спонсоры и сотрудничество с ведущими пансионатами</p>
            </div>
            
            {/* Преимущество 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Собственный патронажный отдел</h4>
              <p>Только проверенные сиделки и работники в МГСР</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;