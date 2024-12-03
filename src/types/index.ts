export type Division = 'MAFGEST' | 'MIR' | 'MIE' | 'MEC';

export type Role = 'ADMIN' | 'INVENTORY_MANAGER' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  division: Division;
  role: Role;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  division: Division;
  minimumStock: number;
}

export interface Transfer {
  id: string;
  equipmentId: string;
  fromDivision: Division;
  toDivision: Division;
  quantity: number;
  date: Date;
  requestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface InventoryMovement {
  id: string;
  equipmentId: string;
  division: Division;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER';
  date: Date;
  userId: string;
}