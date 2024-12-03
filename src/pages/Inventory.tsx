import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Equipment, Division } from '../types';
import { TransferModal } from '../components/TransferModal';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const hasCreatePermission = useAuthStore((state) => 
    state.hasPermission('CREATE_EQUIPMENT')
  );

  // Mock data - replace with actual API calls
  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Safety Gloves',
      type: 'PPE',
      quantity: 100,
      division: 'MAFGEST',
      minimumStock: 20
    },
    {
      id: '2',
      name: 'Safety Boots',
      type: 'PPE',
      quantity: 50,
      division: 'MAFGEST',
      minimumStock: 10
    },
    {
      id: '3',
      name: 'Hard Hat',
      type: 'PPE',
      quantity: 30,
      division: 'MAFGEST',
      minimumStock: 5
    }
  ];

  const handleEquipmentSelect = (item: Equipment) => {
    setSelectedEquipment(prev => {
      const isSelected = prev.some(e => e.id === item.id);
      if (isSelected) {
        return prev.filter(e => e.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleTransfer = (userId: string, quantities: Record<string, number>) => {
    // Replace with actual API call
    console.log('Transferring equipment:', { userId, quantities });
    setSelectedEquipment([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="space-x-3">
          {selectedEquipment.length > 0 && (
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Transfer Selected ({selectedEquipment.length})
            </button>
          )}
          {hasCreatePermission && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Equipment
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search equipment..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipment.map((item) => (
                <tr key={item.id} className={selectedEquipment.some(e => e.id === item.id) ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.some(e => e.id === item.id)}
                      onChange={() => handleEquipmentSelect(item)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.quantity > item.minimumStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.quantity > item.minimumStock ? 'In Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEquipment([item]);
                        setIsTransferModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedEquipment([]);
        }}
        selectedEquipment={selectedEquipment}
        onTransfer={handleTransfer}
      />
    </div>
  );
}