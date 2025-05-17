import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEstates, updateEstate, getDistricts } from './services/EstateService';
import EstateList from './components/Estate/EstateList';
import EstateForm from './components/Estate/EstateForm';

const EstatesManagement = () => {
  const [estates, setEstates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    district: '',
    rooms: '',
    construction_year: '',
    total_area: '',
    building_floors: '',
    description: '',
    cost: ''
  });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estatesData, districtsData] = await Promise.all([
          getEstates(),
          getDistricts()
        ]);
        setEstates(estatesData);
        setDistricts(districtsData.map(d => d.name));
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
      [name]: name === 'rooms' || name === 'construction_year' || name === 'building_floors' 
        ? parseInt(value) || ''
        : name === 'total_area' || name === 'cost'
        ? parseFloat(value) || ''
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEstate = await updateEstate(formData.id, formData);
      setEstates(estates.map(e => e.id === formData.id ? updatedEstate : e));
      setEditMode(false);
      setFormData({ district: '', rooms: '', construction_year: '', total_area: '', building_floors: '', description: '', cost: '' }); // Сброс формы
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleEdit = (estate) => {
    setFormData({
      id: estate.id,
      district: estate.district,
      rooms: estate.rooms,
      construction_year: estate.construction_year,
      total_area: estate.total_area,
      building_floors: estate.building_floors,
      description: estate.description || '',
      cost: estate.cost || ''
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление недвижимостью</h1>
      </div>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {editMode ? (
        <EstateForm
          estate={formData}
          districts={districts}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <EstateList 
          estates={estates} 
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default EstatesManagement;