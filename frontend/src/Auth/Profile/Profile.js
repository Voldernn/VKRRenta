// Profile.js
import React, { useState } from 'react';
import ProfileTabs from './ProfileTabs';
import UserInfo from './UserInfo';
import Estate from './Estate';
import Contracts from './Contract';
import Documents from './Document'; 
import Chat from './components/Chat';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('user-info');

  const tabs = [
    { id: 'user-info', label: 'Личные данные', icon: 'user' },
    { id: 'estate', label: 'Недвижимость', icon: 'home' },
    { id: 'contracts', label: 'Договора', icon: 'file-contract' },
    { id: 'documents', label: 'Документы', icon: 'file-alt' },
    { id: 'chat', label: 'Чат', icon: 'comments' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user-info':
        return <UserInfo />;
      case 'estate':
        return <Estate />;
      case 'contracts':
        return <Contracts />;
      case 'documents':
        return <Documents />;
      case 'chat':
        return <Chat />;
      default:
        return <UserInfo />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white min-h-screen sm:min-h-0 sm:rounded-lg sm:shadow-md sm:mt-10">
      {/* Кнопка выхода для мобильной версии (вверху справа) */}
      <div className="sm:hidden flex justify-end mb-4">
        <button
          onClick={logout}
          className="text-red-600 border border-red-600 px-3 py-1 rounded-full text-xs font-semibold"
        >
          Выйти
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Личный кабинет</h2>
      
      {/* Мобильные табы (внизу экрана) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-1 text-xs ${activeTab === tab.id ? 'text-red-600' : 'text-gray-500'}`}
            >
              <i className={`fas fa-${tab.icon} mb-1`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Десктопные табы */}
      <div className="hidden sm:block">
        <ProfileTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
      
      <div className="mb-16 sm:mb-0 mt-4 sm:mt-6 pb-4">
        {renderTabContent()}
      </div>
      
      {/* Кнопка выхода для десктопной версии */}
      <div className="hidden sm:block">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 sm:mt-8"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile;