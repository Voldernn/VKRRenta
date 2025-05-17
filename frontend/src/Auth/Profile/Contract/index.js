// index.js
import React from 'react';
import ContractsList from './ContractsList';
import SectionCard from '../components/SectionCard';

const Contracts = () => {
  return (
    <SectionCard title="Мои контракты">
      <ContractsList />
    </SectionCard>
  );
};

export default Contracts;