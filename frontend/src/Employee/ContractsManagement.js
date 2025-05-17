import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContracts, createContract, updateContract } from './services/ContractService';
import { getUsers } from './services/UserService';
import ContractList from './components/Contracts/ContractList';
import ContractForm from './components/Contracts/ContractForm';

const ContractsManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    status: 'pending',
    description: '',
    monthly_payment: 0,
    one_time_payment: 0,
    total_payment: 0
  });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractsData, usersData] = await Promise.all([
          getContracts(),
          getUsers()
        ]);
        setContracts(contractsData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editMode]); // Зависимость от editMode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('payment') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedContract;
      
      if (formData.id) {
        updatedContract = await updateContract(formData.id, formData);
        setContracts(prev => prev.map(c => c.id === formData.id ? updatedContract : c));
      } else {
        updatedContract = await createContract(formData);
        setContracts(prev => [...prev, updatedContract]);
      }

      setFormData({
        user_id: '',
        status: 'pending',
        description: '',
        monthly_payment: 0,
        one_time_payment: 0,
        total_payment: 0
      });
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (contract) => {
    setFormData(contract);
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData({
      user_id: '',
      status: 'pending',
      description: '',
      monthly_payment: 0,
      one_time_payment: 0,
      total_payment: 0
    });
    setEditMode(false);
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление договорами</h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Создать договор
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {editMode ? (
        <ContractForm
          contract={formData}
          users={users}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <ContractList 
          contracts={contracts} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default ContractsManagement;