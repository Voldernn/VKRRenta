import React from "react";
import Layout from "./Layout";

const AboutRent = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa" 
          alt="Contract signing" 
          className="w-full h-96 object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Что такое договор ренты?</h1>
          <p className="text-lg md:text-2xl mb-6">Полное руководство по договорам ренты в Москве</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">Все о договоре ренты</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="mb-4">
              Договор ренты - это соглашение, по которому одна сторона (получатель ренты) передает другой стороне (плательщику ренты) в собственность имущество, а плательщик ренты обязуется в обмен на полученное имущество периодически выплачивать получателю ренту в виде определенной денежной суммы.
            </p>
            <p>
              В случае пожизненной ренты выплаты продолжаются до конца жизни получателя ренты, при этом за ним сохраняется право проживания в переданной квартире.
            </p>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Виды договоров ренты</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Вид 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Пожизненная рента</h4>
              <p>Выплаты производятся ежемесячно до конца жизни получателя ренты</p>
            </div>
            
            {/* Вид 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Пожизненное содержание с иждивением</h4>
              <p>Помимо денежных выплат включает обеспечение потребностей в жилье, питании, уходе</p>
            </div>
            
            {/* Вид 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Срочная рента</h4>
              <p>Выплаты производятся в течение определенного срока, указанного в договоре</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">Преимущества договора ренты</h3>
            <ul className="list-disc list-inside bg-white p-6 rounded-lg shadow-md space-y-2">
              <li>Право проживания в квартире сохраняется за получателем ренты</li>
              <li>Стабильный дополнительный доход ежемесячно</li>
              <li>Налоговые льготы для пенсионеров</li>
              <li>Государственная регистрация договора обеспечивает защиту прав</li>
              <li>Возможность расторжения договора в случае нарушения условий</li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold mb-4 text-center text-red-600">Частые вопросы</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold">Что происходит с квартирой после смерти получателя ренты?</h4>
                <p>Квартира полностью переходит в собственность плательщика ренты.</p>
              </div>
              <div>
                <h4 className="font-bold">Можно ли расторгнуть договор ренты?</h4>
                <p>Да, договор можно расторгнуть по соглашению сторон или через суд при нарушении условий.</p>
              </div>
              <div>
                <h4 className="font-bold">Какие документы нужны для оформления?</h4>
                <p>Паспорт, документы на квартиру, выписка из ЕГРН, справка об отсутствии задолженностей.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutRent;