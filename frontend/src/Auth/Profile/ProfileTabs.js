import React from 'react';

const ProfileTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex flex-wrap sm:flex-nowrap sm:space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
              activeTab === tab.id
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;