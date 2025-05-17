import React from 'react';
import { useAuth } from '../../AuthContext';

const UserDetails = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Email:</span>
        <span>{user.email}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Имя:</span>
        <span>{user.first_name}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Фамилия:</span>
        <span>{user.last_name}</span>
      </div>
      <div className="flex justify-between border-b pb-2">
        <span className="font-semibold">Возраст:</span>
        <span>{user.age}</span>
      </div>
    </div>
  );
};

export default UserDetails;