import React from 'react';

type StatusType = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN' | 'OUT' | 'TRANSFER';
type BadgeProps = {
  status: StatusType;
};

export function StatusBadge({ status }: BadgeProps) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    IN: 'bg-green-100 text-green-800',
    OUT: 'bg-red-100 text-red-800',
    TRANSFER: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}