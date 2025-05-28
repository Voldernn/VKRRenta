import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import { FaBars, FaTimes, FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const isEmployeeLoggedIn = !!localStorage.getItem('employeeToken');
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="font-sans flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
          <div className="flex items-center">
            {/* Гамбургер-кнопка (видна только на мобильных) */}
            <button 
              onClick={toggleMobileMenu}
              className="text-2xl text-gray-600 mr-2 sm:mr-4 sm:hidden"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <img 
              src="https://placehold.co/100x50" 
              alt="Company Logo" 
              className="h-10 sm:h-12" 
            />
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-xl sm:text-2xl font-bold">Московская городская служба ренты</p>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={() => navigate('/profile')}
                className="text-red-600 border border-red-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
              >
                Кабинет
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-red-600 border border-red-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
              >
                Войти
              </button>
            )}
          </div>
        </div>
        
        {/* Мобильное меню (видно только на мобильных) */}
        {isMobileMenuOpen && (
          <nav className="bg-gray-100 block sm:hidden">
            <div className="container mx-auto flex flex-col space-y-2 py-2 px-4">
              <Link to="/" className="text-gray-700 hover:text-red-600 py-1" onClick={toggleMobileMenu}>ГЛАВНАЯ</Link>
              <Link to="/pensioners" className="text-gray-700 hover:text-red-600 py-1" onClick={toggleMobileMenu}>ПЕНСИОНЕРАМ</Link>
              <Link to="/about-rent" className="text-gray-700 hover:text-red-600 py-1" onClick={toggleMobileMenu}>О РЕНТЕ</Link>
              <Link to="/calculator" className="text-gray-700 hover:text-red-600 py-1" onClick={toggleMobileMenu}>КАЛЬКУЛЯТОР</Link>
              <Link to="/about-us" className="text-gray-700 hover:text-red-600 py-1" onClick={toggleMobileMenu}>О НАС</Link>
            </div>
          </nav>
        )}
        
        {/* Десктопное меню (видно только на десктопах) */}
        <nav className="bg-gray-100 hidden sm:block">
          <div className="container mx-auto flex justify-center space-x-4 md:space-x-8 lg:space-x-16 py-2">
            <Link to="/" className="text-gray-700 hover:text-red-600 text-sm md:text-base">ГЛАВНАЯ</Link>
            <Link to="/pensioners" className="text-gray-700 hover:text-red-600 text-sm md:text-base">ПЕНСИОНЕРАМ</Link>
            <Link to="/about-rent" className="text-gray-700 hover:text-red-600 text-sm md:text-base">О РЕНТЕ</Link>
            <Link to="/calculator" className="text-gray-700 hover:text-red-600 text-sm md:text-base">КАЛЬКУЛЯТОР</Link>
            <Link to="/about-us" className="text-gray-700 hover:text-red-600 text-sm md:text-base">О НАС</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-0">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Колонка 1: Контакты */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Контакты</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li className="flex items-start">
                  <FaPhoneAlt className="mr-2 mt-1 text-sm sm:text-base" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Телефоны:</p>
                    <p className="text-sm sm:text-base">8 (495) ххх-хх-хх</p>
                    <p className="text-sm sm:text-base">8 (495) ххх-хх-хх</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaEnvelope className="mr-2 mt-1 text-sm sm:text-base" />
                  <p className="text-sm sm:text-base">info@хххххх.ru</p>
                </li>
                <li className="flex items-start">
                  <FaClock className="mr-2 mt-1 text-sm sm:text-base" />
                  <p className="text-sm sm:text-base">Пн-Пт: 9:00 - 18:00</p>
                </li>
              </ul>
            </div>
            
            {/* Колонка 2: Адреса */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Адреса</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-sm sm:text-base" />
                  <p className="text-sm sm:text-base">г. Москва, Сретенский бульвар, д. 2</p>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-sm sm:text-base" />
                  <p className="text-sm sm:text-base">г. Москва, ул. Тверская, д. 20</p>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-sm sm:text-base" />
                  <p className="text-sm sm:text-base">г. Москва, Ленинский проспект, д. 42</p>
                </li>
              </ul>
            </div>
            
            {/* Колонка 3: Соцсети */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Мы в соцсетях</h3>
              <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                <li>
                  <a href="#" className="text-white hover:text-red-400 text-sm sm:text-base">Facebook</a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-red-400 text-sm sm:text-base">Instagram</a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-red-400 text-sm sm:text-base">YouTube</a>
                </li>
                <li>
                  <a href="#" className="text-white hover:text-red-400 text-sm sm:text-base">VK</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Нижняя часть футера */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>© 2023 Московская городская служба ренты. Все права защищены.</p>
            <div className="mt-2 flex flex-wrap justify-center">
              <a href="#" className="hover:text-white mx-1 sm:mx-2 text-xs sm:text-sm">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white mx-1 sm:mx-2 text-xs sm:text-sm">Пользовательское соглашение</a>
              {isEmployeeLoggedIn ? (
                <button 
                  onClick={() => navigate('/employee/dashboard')}
                  className="text-gray-400 hover:text-blue-400 mx-1 sm:mx-2 text-xs sm:text-sm"
                >
                  Панель управления
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/employee')}
                  className="text-gray-400 hover:text-blue-400 mx-1 sm:mx-2 text-xs sm:text-sm"
                >
                  Вход для сотрудников
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;