import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';

export function InvestmentRow({investment, onEdit, onDelete}) {
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
      </td>
      <td>{investment.name}</td>
      <td>{investment.symbol}</td>
      <td>{investment.shares}</td>
      <td>{investment.price}</td>
      <td>{investment.currentValue}</td>
    </tr>
  );
}