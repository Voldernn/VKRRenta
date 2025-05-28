import React from "react";
import Layout from "./Layout";

const Pensioners = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <img 
          src="https://placehold.co/2000x2000" 
          className="w-full h-96 object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Специальные условия для пенсионеров</h1>
          <p className="text-lg md:text-2xl mb-6">Лучшие программы ренты для людей старшего поколения</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">Программы ренты для пенсионеров</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="mb-4">
              Московская городская служба ренты предлагает специальные условия для пенсионеров, которые хотят улучшить свое финансовое положение, сохранив при этом право проживания в своей квартире.
            </p>
            <p>
              Наши программы разработаны с учетом потребностей людей старшего возраста и включают дополнительные социальные гарантии.
            </p>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Наши предложения для пенсионеров</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Предложение 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Пожизненная рента</h4>
              <p>Ежемесячные выплаты до конца жизни с сохранением права проживания</p>
            </div>
            
            {/* Предложение 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Срочная рента</h4>
              <p>Выплаты в течение определенного срока (5, 10, 15 лет)</p>
            </div>
            
            {/* Предложение 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Дополнительные услуги</h4>
              <p>Бесплатные юридические консультации и помощь в оформлении документов</p>
            </div>
            
            {/* Предложение 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Социальная поддержка</h4>
              <p>Организация ухода, доставка продуктов и лекарств</p>
            </div>
          </div>

          <div className="mt-12 bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold mb-4 text-center text-red-600">Как оформить ренту пенсионеру?</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Консультация со специалистом</li>
              <li>Оценка недвижимости</li>
              <li>Подбор оптимальной программы</li>
              <li>Подписание договора у нотариуса</li>
              <li>Начало выплат уже со следующего месяца</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pensioners;