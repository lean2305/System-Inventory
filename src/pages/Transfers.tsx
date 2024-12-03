import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Transfer } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable } from '../components/DataTable';
import { useAuthStore } from '../store/authStore';

export function Transfers() {
  const [statusFilter, setStatusFilter] = useState('');
  const user = useAuthStore((state) => state.user);
  const hasCreatePermission = useAuthStore((state) => 
    state.hasPermission('CREATE_TRANSFER')
  );

  // Mock data - replace with actual API calls
  const transfers: Transfer[] = [
    {
      id: '1',
      equipmentId: '1',
      fromDivision: 'MAFGEST',
      toDivision: 'MIR',
      quantity: 5,
      date: new Date(),
      requestedBy: 'John Doe',
      status: 'PENDING'
    },
    // Add more mock transfers as needed
  ];

  const columns = [
    {
      header: 'Date',
      accessor: (transfer: Transfer) => format(transfer.date, 'dd/MM/yyyy HH:mm')
    },
    {
      header: 'From',
      accessor: 'fromDivision'
    },
    {
      header: 'To',
      accessor: 'toDivision'
    },
    {
      header: 'Equipment',
      accessor: () => 'Safety Gloves' // Replace with actual equipment name lookup
    },
    {
      header: 'Quantity',
      accessor: 'quantity'
    },
    {
      header: 'Status',
      accessor: (transfer: Transfer) => <StatusBadge status={transfer.status} />
    },
    {
      header: 'Actions',
      accessor: (transfer: Transfer) => (
        <div className="space-x-2">
          {user?.role === 'ADMIN' && transfer.status === 'PENDING' && (
            <>
              <button className="text-green-600 hover:text-green-800">
                Approve
              </button>
              <button className="text-red-600 hover:text-red-800">
                Reject
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transfer Requests</h1>
        {hasCreatePermission && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Transfer
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <DataTable columns={columns} data={transfers} />
      </div>
    </div>
  );
}