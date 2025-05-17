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
    { id: 'user-info', label: 'Личные данные' },
    { id: 'estate', label: 'Моя недвижимость' },
    { id: 'contracts', label: 'Мои договора' },
    { id: 'documents', label: 'Мои документы' }, // Новая вкладка
    { id: 'chat', label: 'Чат с поддержкой' },
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Личный кабинет</h2>
      
      <ProfileTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <div className="mt-6">
        {renderTabContent()}
      </div>
      
      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-8"
      >
        Выйти
      </button>
    </div>
  );
};

export default Profile;