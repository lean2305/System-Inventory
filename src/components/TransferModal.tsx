import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Equipment, User } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipment: Equipment[];
  onTransfer: (userId: string, quantities: Record<string, number>) => void;
}

export function TransferModal({ isOpen, onClose, selectedEquipment, onTransfer }: TransferModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    selectedEquipment.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );
  const [selectedUser, setSelectedUser] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock users data - replace with actual API call
  const users: User[] = [
    { id: '2', name: 'John Doe', email: 'john@mafirol.com', division: 'MAFGEST', role: 'USER', permissions: [] },
    { id: '3', name: 'Jane Smith', email: 'jane@mafirol.com', division: 'MIR', role: 'USER', permissions: [] },
  ];

  const handleQuantityChange = (equipmentId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const equipment = selectedEquipment.find(e => e.id === equipmentId);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (numValue <= 0) {
        newErrors[equipmentId] = 'Quantity must be greater than 0';
      } else if (equipment && numValue > equipment.quantity) {
        newErrors[equipmentId] = 'Quantity exceeds available stock';
      } else {
        delete newErrors[equipmentId];
      }
      return newErrors;
    });

    setQuantities(prev => ({
      ...prev,
      [equipmentId]: numValue
    }));
  };

  const isValid = () => {
    return (
      selectedUser &&
      Object.keys(errors).length === 0 &&
      Object.values(quantities).every(q => q > 0) &&
      selectedEquipment.every(e => quantities[e.id] <= e.quantity)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) {
      onTransfer(selectedUser, quantities);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transfer Equipment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Select a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.division}
                </option>
              ))}
            </select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity to Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedEquipment.map(equipment => (
                  <tr key={equipment.id}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                      <div className="text-sm text-gray-500">{equipment.type}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{equipment.quantity}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <input
                          type="number"
                          min="1"
                          max={equipment.quantity}
                          className={`border rounded-lg p-2 w-32 ${
                            errors[equipment.id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={quantities[equipment.id] || ''}
                          onChange={(e) => handleQuantityChange(equipment.id, e.target.value)}
                          required
                        />
                        {errors[equipment.id] && (
                          <div className="flex items-center text-xs text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors[equipment.id]}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}