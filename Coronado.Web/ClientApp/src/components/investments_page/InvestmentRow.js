import React from 'react';
import { DeleteIcon } from '../icons/DeleteIcon';
import { EditIcon } from '../icons/EditIcon';
import { Icon } from '../icons/Icon';
import { MoneyFormat } from '../common/DecimalFormat';
import { TableRow, TableCell } from '@material-ui/core';

export function InvestmentRow({investment, onEdit, onDelete, openPriceHistory}) {
  
  return (
    <TableRow>
      <TableCell>
      <EditIcon onStartEditing={onEdit} />
      <DeleteIcon onDelete={onDelete} />
      <Icon onClick={openPriceHistory} glyph="dollar-sign" title="Show historical prices" />
      </TableCell>
      <TableCell>{investment.name}</TableCell>
      <TableCell>{investment.symbol}</TableCell>
      <TableCell>{investment.currency}</TableCell>
      <TableCell>{investment.shares}</TableCell>
      <TableCell><MoneyFormat amount={investment.lastPrice} /></TableCell>
      <TableCell><MoneyFormat amount={investment.currentValue} /></TableCell>
    </TableRow>
  );
}