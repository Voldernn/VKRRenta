import React from "react";
import Layout from "./Layout";

const AboutUs = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <img 
          src="https://placehold.co/2000x2000" 
          className="w-full h-96 object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">О Московской городской службе ренты</h1>
          <p className="text-lg md:text-2xl mb-6">20 лет опыта работы на рынке рентных программ</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">Наша история</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="mb-4">
              Московская городская служба ренты была основана в 2003 году с целью создания цивилизованного рынка рентных программ в столице. За 20 лет работы мы помогли более чем 15 000 москвичей улучшить свое финансовое положение, сохранив при этом право проживания в своих квартирах.
            </p>
            <p>
              Сегодня МГСР - это крупнейшая и наиболее надежная организация на рынке рентных программ Москвы, сотрудничающая с ведущими финансовыми институтами и социальными службами города.
            </p>
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Наши принципы</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Принцип 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Прозрачность</h4>
              <p>Все условия договора четко прописываются и объясняются клиенту</p>
            </div>
            
            {/* Принцип 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Надежность</h4>
              <p>Все договоры регистрируются в Росреестре и защищены законом</p>
            </div>
            
            {/* Принцип 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Забота</h4>
              <p>Индивидуальный подход к каждому клиенту, особенно пожилым людям</p>
            </div>
            
            {/* Принцип 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Профессионализм</h4>
              <p>Все наши специалисты имеют профильное образование и опыт работы</p>
            </div>
            
            {/* Принцип 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Ответственность</h4>
              <p>Мы несем полную ответственность за выполнение условий договора</p>
            </div>
            
            {/* Принцип 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-2 text-red-600">Развитие</h4>
              <p>Постоянно улучшаем наши программы и сервис для клиентов</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">Наша команда</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                В нашей команде работают высококвалифицированные юристы, финансисты и социальные работники, которые помогут вам на всех этапах оформления договора ренты.
              </p>
              <p>
                Мы гордимся тем, что многие наши сотрудники работают в компании с момента ее основания, что гарантирует высочайший уровень экспертизы и преемственности в работе с клиентами.
              </p>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold mb-4 text-center text-red-600">Наши достижения</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-red-600">20+</p>
                <p>лет на рынке</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">15 000+</p>
                <p>довольных клиентов</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">40+</p>
                <p>профессионалов в команде</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">3</p>
                <p>офиса в Москве</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;