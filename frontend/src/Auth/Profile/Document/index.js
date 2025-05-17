// index.js
import React from 'react';
import DocumentsList from './DocumentsList';
import SectionCard from '../components/SectionCard';

const Documents = () => {
  return (
    <SectionCard title="Мои документы">
      <DocumentsList />
    </SectionCard>
  );
};

export default Documents;