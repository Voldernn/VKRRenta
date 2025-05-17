import React from 'react';
import EstateList from './EstateList';
import SectionCard from '../components/SectionCard';

const Estate = () => {
  return (
    <SectionCard title="Моя недвижимость">
      <EstateList />
    </SectionCard>
  );
};

export default Estate;