import React from 'react';
import UserDetails from './UserDetails';
import SectionCard from '../components/SectionCard';

const UserInfo = () => {
  return (
    <SectionCard title="Личные данные">
      <UserDetails />
    </SectionCard>
  );
};

export default UserInfo;