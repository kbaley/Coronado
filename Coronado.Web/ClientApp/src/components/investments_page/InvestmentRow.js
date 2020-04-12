import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';

export function InvestmentRow({investment, onEdit, onDelete, openPriceHistory}) {
  
  return (
    <tr>
      <td>
        <EditIcon onStartEditing={onEdit} />
        <DeleteIcon onDelete={onDelete} />
        <Icon onClick={openPriceHistory} glyph="euro" title="Show historical prices" />
      </td>
      <td>{investment.name}</td>
      <td>{investment.symbol}</td>
      <td>{investment.currency}</td>
      <td>{investment.shares}</td>
      <td>{investment.lastPrice}</td>
      <td>{investment.currentValue}</td>
    </tr>
  );
}