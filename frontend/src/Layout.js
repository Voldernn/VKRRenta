import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const isEmployeeLoggedIn = !!localStorage.getItem('employeeToken');
  const navigate = useNavigate();

  return (
    <div className="font-sans flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <button className="text-2xl text-gray-600 mr-4">
              <i className="fas fa-bars"></i>
            </button>
            <img src="https://placehold.co/100x50" alt="Company Logo" className="h-12" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">Московская городская служба ренты</p>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => navigate('/profile')}
                className="text-red-600 border border-red-600 px-4 py-2 rounded-full text-sm font-semibold"
              >
                Личный кабинет
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-red-600 border border-red-600 px-4 py-2 rounded-full text-sm font-semibold"
              >
                Войти в личный кабинет
              </button>
            )}
          </div>
        </div>
        <nav className="bg-gray-100">
          <div className="container mx-auto flex justify-center space-x-16 py-2">
          <Link to="/" className="text-gray-700 hover:text-red-600">ГЛАВНАЯ СТРАНИЦА</Link>
          <Link to="/pensioners" className="text-gray-700 hover:text-red-600">ПЕНСИОНЕРАМ</Link>
          <Link to="/about-rent" className="text-gray-700 hover:text-red-600">ЧТО ТАКОЕ РЕНТА</Link>
          <Link to="/calculator" className="text-gray-700 hover:text-red-600">КАЛЬКУЛЯТОР РЕНТЫ</Link>
          <Link to="/about-us" className="text-gray-700 hover:text-red-600">О НАС</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Колонка 1: Контакты */}
            <div>
              <h3 className="text-xl font-bold mb-4">Контакты</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-phone-alt mr-2 mt-1"></i>
                  <div>
                    <p className="font-semibold">Телефоны:</p>
                    <p>8 (495) 226-07-07</p>
                    <p>8 (495) 625-03-88</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-envelope mr-2 mt-1"></i>
                  <p>info@renta-moscow.ru</p>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-clock mr-2 mt-1"></i>
                  <p>Пн-Пт: 9:00 - 18:00</p>
                </li>
              </ul>
            </div>
            
            {/* Колонка 2: Адреса */}
            <div>
              <h3 className="text-xl font-bold mb-4">Адреса</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mr-2 mt-1"></i>
                  <p>г. Москва, Сретенский бульвар, д. 2</p>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mr-2 mt-1"></i>
                  <p>г. Москва, ул. Тверская, д. 20</p>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mr-2 mt-1"></i>
                  <p>г. Москва, Ленинский проспект, д. 42</p>
                </li>
              </ul>
            </div>
            
            {/* Колонка 4: Соцсети и кнопка */}
            <div>
            <h3 className="text-xl font-bold mb-4">Мы в соцсетях</h3>
            <ul className="list-disc list-inside mb-6">
                <li>
                <a href="#" className="text-white hover:text-red-400">Facebook</a>
                </li>
                <li>
                <a href="#" className="text-white hover:text-red-400">Instagram</a>
                </li>
                <li>
                <a href="#" className="text-white hover:text-red-400">YouTube</a>
                </li>
                <li>
                <a href="#" className="text-white hover:text-red-400">VK</a>
                </li>
            </ul>
            </div>
          </div>
          
          {/* Нижняя часть футера */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 Московская городская служба ренты. Все права защищены.</p>
            <div className="mt-2">
              <a href="#" className="hover:text-white mx-2">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white mx-2">Пользовательское соглашение</a>
              {isEmployeeLoggedIn ? (
              <a 
              href="/employee/dashboard" 
              className="text-gray-600 hover:text-blue-600"
              >
                Панель управления
              </a>
            ) : (
              <a 
                href="/employee" 
                className="text-gray-600 hover:text-blue-600"
              >
                Вход для сотрудников
              </a>
            )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;